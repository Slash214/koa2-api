/**
 * @description 因为本项目比较简单功能逻辑少 所有 登陆逻辑 和 获取轮播图逻辑 统统放这里处理
 * 菜单和商品是采用的mvc去实现，感兴趣的可以去查看文件，这里就统一全部处理 后期维护 可单独拆分
 * 图片上传 逻辑 也放到这里处理
 * @author 爱呵呵 Joshua Yang
 */

const router = require('koa-router')()
const { ErrorModel,SuccessModel } = require('../models/ResModel')
const { ParameterIsNull, UpdateInfoFail, LoginNoFind, addFail } = require('../models/ErrorInfo')
const { Admin, Banner, Goods } = require('../db/model')
const { formatData, formatUser } = require('../services/_format')
const doCrypto = require('../utils/cryp')
const jwt = require('jsonwebtoken')
const { Token_Config } = require('../conf/secreKey')
const koaFrom = require('formidable-upload-koa')
const { saveFile } = require('../utils/upload')
const { Op } = require("../db/type");

router.prefix('/total')

/**
 * @description 账号注册 后面不开放注册功能 
 * @param { string } username 账号
 * @param { string } password 密码
 */
router.post('/register', async (ctx, next) => {
  const { username, password } = ctx.request.body
  if ( username && password ) {
    const result = await Admin.create({
      username,
      password: doCrypto(password)
    })
    if (result.dataValues?.id) {
      ctx.body = new SuccessModel('注册成功')
    } else ctx.body = new ErrorModel('注册失败')
  } else ctx.body = new ErrorModel(ParameterIsNull)
})

/**
 * @description 账号登陆 
 * @param { string } username 管理员用户名 
 * @param { string } password 密码 （md5加密处理）
 */
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  console.log('当前账号', username, password)
  if ( username && password ) {
    const whereOpt = {
      username,
      password: doCrypto(password)
    }

    const result = await Admin.findOne({
      where: whereOpt
    })  

    // console.log('搜索结果', result)
    if (result == null) {
      // 未找到
      ctx.body = new ErrorModel(LoginNoFind)
    } else {
      let formatRes = formatUser(result.dataValues)
      ctx.body = new SuccessModel(formatRes)
    }

  } else ctx.body = new ErrorModel(ParameterIsNull)
})

/**
 * @description 修改管理员密码 账号无法修改 
 * @param { string } password 密码  注：（使用了md5加密的）
 */
router.post('/updateInfo', async (ctx, next) => {
  const { username, password } = ctx.request.body
  if ( username && password ) {
    const updateData = {
      password: doCrypto(password)
    }
    const whereData = {
      username: username
    }
    const result = await Admin.update(updateData, {
      where: whereData
    })

    if (result[0] > 0) {
      // 修改成功
      ctx.body = new SuccessModel('账号更新成功')
    } else ctx.body = new ErrorModel(UpdateInfoFail)

  } else ctx.body = new ErrorModel(ParameterIsNull) 
})


router.post('/getuserinfo', async (ctx, next) => {
   const { token } = ctx.request.body
   console.log('获取的token' , token)
   const tokenItem = jwt.verify(token.replace("ahh", ""), Token_Config.privateKey)
   // 将token的创建的时间和过期时间结构出来
   console.log(tokenItem)
   ctx.body = new SuccessModel(tokenItem)
})

/**
 * @description 获取轮播图 不需要参数 默认只获取 5 张
 */
router.get('/banner', async (ctx, next) => {
  const result = await Banner.findAndCountAll({
    limit: 5,
    order: [['id', 'desc']]
  })

  let item = formatData(result.rows.map((row) => row.dataValues))
  ctx.body = new SuccessModel(item)
})

/**
 * @description 增加轮播图  （上限 5 张 【如有特殊需求可以改变】）
 * @param { string } imgUrl 图片URL 
 * @param { string } link 图片跳转链接 （这里不需要）
 */
router.post('/addbanner', async (ctx, next) => {
  const { imgUrl } = ctx.request.body
  if (!imgUrl) {
    ctx.body = new ErrorModel(ParameterIsNull)
    return
  }
  const result = await Banner.create({
    imgUrl,
    link: '',
  })
  
  if (result.dataValues) {
    // 增加成功
    ctx.body = new SuccessModel('增加成功')
  } else {
    // 增加失败
    ctx.body = new ErrorModel(addFail)
  }
})


// 修改图片
router.post('/updateImg', async (ctx, next) => {
  const { imgId, imgUrl } = ctx.request.body

  if (imgId && imgUrl) {

    const whereData = { imgUrl }
    const result = await Banner.update(whereData, {
      where: { id: imgId }
    }) 
    
    if (result > 0 ) {
      ctx.body = new SuccessModel('修改成功')
    } else {
      ctx.body = new ErrorModel(SQLDetailFail)
    }
  } else ctx.body = new ErrorModel(ParameterIsNull)
})

/**
 * @description 删除轮播图 
 * @param { number } id 图片ID
 */
router.post('/delbanner', async (ctx, next) => {
  const { id } = ctx.request.body
  if (!id) {
    ctx.body = new ErrorModel(ParameterIsNull)
    return
  }
  const result = await Banner.destroy({
    where: { id }
  })
  
  if (result > 0 ) {
    // 增加成功
    ctx.body = new SuccessModel('删除成功')
  } else {
    // 增加失败
    ctx.body = new ErrorModel(SQLDetailFail)
  }
})


router.post('/imgupload', koaFrom(),  async (ctx, next) => {
  const file = ctx.req.files['file']
  if (!file) {
    return
  }
  const { size, path, name, type } = file
  ctx.body = await saveFile({
      name,
      type,
      size,
      filePath: path
  })
})

router.get('/search', async (ctx, next) => {
  let { keyword, pageSize, pageIndex } = ctx.request.query
  // console.log('我居然了')
  pageSize = pageSize || 20
  pageIndex = pageIndex || 1
  pageIndex = pageIndex ? pageIndex - 1 : pageIndex;
  console.log('搜索的关键词', keyword)
  if (keyword) {
    const whereOpt = {
      goods_name: {
        [Op.like]: "%" + keyword + "%",
      },
    };

    const result = await Goods.findAndCountAll({
      limit: +pageSize,
      offset: pageSize * +pageIndex,
      order: [['id', 'desc']],
      where: whereOpt
    })
    let item = formatData(result.rows.map((row) => row.dataValues))
    let total = result.count
    const ResData = {
      state: 'success',
      data: item,
      total,
      code: 200
    }
    ctx.body = ResData
  } else {
    ctx.body = new ErrorModel(ParameterIsNull)
  }
})

module.exports = router
