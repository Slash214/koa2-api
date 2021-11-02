/**
 * @description 微信支付逻辑   这里我偷懒 把用户的地址逻辑 和订单的增加获取 都放这里处理
 * @author 爱呵呵 Joshua Yang
 */

const axios = require('axios')
const router = require('koa-router')()
const { ErrorModel,SuccessModel } = require('../models/ResModel')
const {wechatApp} = require('../conf/wechat')
const Util = require('../utils/wechat')
const crypto = require('crypto');
const { ParameterIsNull, SQLDetailFail } = require('../models/ErrorInfo')
const { User,Address, Order } = require('../db/model')
const { formatData } = require('../services/_format')

router.prefix('/wechat')


//支付通知
router.get('/notify', async (ctx, next) => {
    console.log(ctx.request.body)
    console.log('支付成功')
})

//订单支付
router.post('/payorder', async (ctx, next) => {
    let { code, total_fee, openid } = ctx.request.body
    // 开始的请求 需要code 是因为 在服务端完成获取用户Openid的情况 
    // 如传入Openid 就不需要code 换取, 但肯定需要商品的价格

    console.log('请求参数', code ,total_fee, openid)
    if (!total_fee && openid || code) {
      ctx.body = new ErrorModel(ParameterIsNull)
      return
    }

    if (!openid) {
      let result = await _getOpenid(code, wechatApp.appId, wechatApp.secret)
      openid = result?.openid
    }
    
    console.log('获取的opendid', openid)
    let apiUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    total_fee = total_fee *100   //订单价格,单位是分
    let detail = '秦风超市商品购买订单'; //对商品的描述
    let out_trade_no = Util.getWxPayOrdrID(); //订单号
    let timeStamp = Util.createTimeStamp(); //时间节点
    let nonce_str = Util.createNonceStr() + Util.createTimeStamp(); //随机字符串
    let spbill_create_ip = Util.get_client_ip(ctx); //请求ip
    let notify_url ='https://lovehaha.cn/xcx/wechat/notify';  
    let formData = Util.getfromData(wechatApp.appId, detail, wechatApp.mch_id, nonce_str,notify_url, openid, out_trade_no, spbill_create_ip, total_fee)
    
    // console.log('当前表单', formData)
    const item  = await _ReqInfo({ formData, apiUrl, nonce_str, timeStamp })

    ctx.body = new SuccessModel(item)
})

function dealPaymentSuccessful(resultCode, body, nonce_str, timeStamp){           
    if(resultCode === 'SUCCESS'){ 
        //成功
        let prepay_id = Util.getXMLNodeValue('prepay_id', body.toString("utf-8")).split('[')[2].split(']')[0]; //获取到prepay_id
        //签名
        let _paySignjs = Util.paysignjs(wechatApp.appId, nonce_str, 'prepay_id='+ prepay_id,'MD5',timeStamp);
        let args = {
            appId: wechatApp.appId,
            timeStamp: timeStamp,
            nonceStr: nonce_str,
            signType: "MD5",
            package: prepay_id,
            paySign: _paySignjs,
            status:200
        };
        return args;
    }
}

async function _ReqInfo({ formData, apiUrl, nonce_str, timeStamp }) {
    return new Promise((reslove, reject) => {
        axios({
            method: 'POST',
            url: apiUrl,
            data: formData
        }).then(res => {
            let result_code = Util.getXMLNodeValue('result_code', res.data.toString("utf-8"));
            let resultCode = result_code.split('[')[2].split(']')[0];
            console.log('状态', resultCode)
            if (resultCode = 'SUCCESS') {
                console.log('请求成功')
                let item = dealPaymentSuccessful(resultCode, res.data, nonce_str, timeStamp)
                console.log(item)
                reslove(item)
            } else {
                let item = {
                    msg: '失败',
                    resultCode,
                }
                reslove(item)
            }
        }).catch(err => {
            console.log(err)
            console.log('请求失败')
        })
    })
}

// 获取用户Openid （也可以小程序传入）
async function _getOpenid(code, appid,secret) {
  return new Promise((reslove, reject) => {
      axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`, {
      }).then(res => {
        reslove(res.data)
      }).catch(err => {
        console.log(err)
        reject(res.data)
      })
  })
}

// 小程序用户登陆
router.post('/login', async (ctx, next) => {
    const { code } = ctx.request.body
    if (code) {
      const { session_key, openid} = await _getOpenid(code, wechatApp.appId, wechatApp.secret)
      console.log('获取的opendid', openid) // 存入数据库
      console.log('获取的session_key', session_key) // 存入数据库
      ctx.body = new SuccessModel('测试')

      // 先去查看是否存在当前用户信息是否存在 
      const whereOpt = { openid }
      const flag = await User.findOne({
        where: whereOpt
      })
      // console.log(flag)
      if (flag == null) {
        // 不存在 开始注册逻辑
        const result = await User.create({ openid })
        ctx.body = new SuccessModel(formatData(result.dataValues))
      } else {
        // 存在
        ctx.body = new SuccessModel(formatData(flag.dataValues)) 
      }

    } else ctx.body = new ErrorModel(ParameterIsNull)
})

// 获取用户地址 
router.get('/address', async (ctx, next) => {
    const { user_id } = ctx.request.query
    if (user_id) {
      const result = await Address.findAndCountAll({
        limit: 5,
        order: [['id','desc']],
        where: { user_id }
      })

      let item = formatData(result.rows.map((row) => row.dataValues))
      ctx.body = new SuccessModel(item)
    } else {
        ctx.body = new ErrorModel(ParameterIsNull)
    }
})

// 设置默认地址
router.post('/default', async (ctx, next) => {
  const { isdefault, user_id, address_id } = ctx.request.body
  // 1 设置为默认   2 取消默认
  if ( isdefault && user_id && address_id) {
    const whereData = {
      isdefault
    }
     
    const result = await Address.update(whereData, {
     where: { user_id, id: address_id }
    })  
    
    if (result > 0 ) {
      ctx.body = new SuccessModel('设置成功')
    } else {
      ctx.body = new ErrorModel(SQLDetailFail)
    }

  } else ctx.body = new ErrorModel(ParameterIsNull)
})

// 增加用户地址
router.post('/addAddress', async (ctx, next) => {
    const { user_id, phone, desc } = ctx.request.body
    if ( user_id && phone ) {
      try {
        const result = await Address.create({
           user_id,
           phone,
           desc
        })  
        if (result.dataValues?.id) {
            ctx.body = new SuccessModel('添加成功')
        } else ctx.body = new ErrorModel('添加失败')
      } catch (error) {
        console.log(error)  
      }
    } else ctx.body = new ErrorModel(ParameterIsNull)
})

// 修改用户地址
router.post('/updateAddress', async (ctx, next) => {
  const { user_id,address_id, phone, desc, old_address_id } = ctx.request.body

  if (!user_id || !address_id) {
    ctx.body = new ErrorModel(ParameterIsNull)
    return
  }


  // 如果存在新地址id 和 老地址 id 证明是设置默认地址
  if ( address_id && user_id) {
    const oldData = { isdefault: 2 }
    const newData = { isdefault: 1 }
    const r1
    // 改变之前的
    if (Boolean(old_address_id)) {
      r1 = await Address.update(oldData, {
        where: { user_id, id: old_address_id }
      })
    }

    const r2 = await Address.update(newData, {
      where: { user_id, id: address_id }
    })

    if (!old_address_id && r2 > 0) {
      ctx.body = new SuccessModel('修改成功')
      return
    } 

    if (r1 > 0 && r2 > 0 ) {
      ctx.body = new SuccessModel('修改成功')
    } else ctx.body = new ErrorModel(SQLDetailFail)
  } else {
    const whereData = { phone, desc }
    const r3 = await Address.update(whereData, {
      where: { user_id, id: address_id }
    })

    if (r3 > 0) {
      ctx.body = new SuccessModel('修改成功')
    } else ctx.body = new ErrorModel(SQLDetailFail)
  }
})

// 删除用户地址
router.get('/delAddress', async (ctx, next) => {
    const { user_id, address_id } = ctx.request.query
    if (user_id && address_id) {
        const result = await Address.destroy({
          where: { user_id, id: address_id }
        })
  
        if (result > 0 ) {
            ctx.body = new SuccessModel('删除成功')
        } else {
            ctx.body = new ErrorModel(SQLDetailFail)
        }
      } else {
          ctx.body = new ErrorModel(ParameterIsNull)
      }
})

// 获取用户订单
router.get('/order', async (ctx, next) => {
  let { user_id, pageSize = 20, pageIndex } = ctx.request.query
   pageIndex = pageIndex ? pageIndex - 1 : 0
   const whereOpt = {}
  if (+user_id !== -1) {
    whereOpt['user_id'] = user_id
  }
   
  console.log(whereOpt)
  if (user_id) {
    const result = await Order.findAndCountAll({
        limit: +pageSize,
        offset: +pageSize * +pageIndex,
        order: [['id', 'desc']],
        where: whereOpt
    })
 
    // console.log(result)
    let item = formatData(result.rows.map((row) => row.dataValues))
    // console.log(item)
    let total = result.count
    const resData = {
        state: 'success',
        data: item,
        total,
        code: 200
    }
    ctx.body = resData
  } else ctx.body = new ErrorModel(ParameterIsNull)
})

// 增加用户订单
router.post('/addorder', async (ctx, next) => {
    const { user_id, order_address, phone, order_number, order_info,order_total,order_remake } = ctx.request.body
    if ( user_id && phone && order_address && order_number && order_total && order_info) {
      
      const result = await Order.create({
        user_id,
        phone,
        order_address,
        order_number,
        order_total,
        order_info,
        order_remake
      })  

      if (result?.dataValues.id) {
        ctx.body = new SuccessModel('增加成功')
      } else ctx.body = new ErrorModel('增加失败')

    } else ctx.body = new ErrorModel(ParameterIsNull)
})

// 删除用户订单 -- 这里使用软删除  因为需要保存用户的订单数量 也可以不删除 使用分页查询
module.exports = router