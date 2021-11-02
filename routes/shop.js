/**
 * @description 商品路由
 * @author 爱呵呵
 */

const router = require('koa-router')()
const {
  ErrorModel
} = require('../models/ResModel')
const {
  ParameterIsNull
} = require('../models/ErrorInfo')
const {
  getShopList,
  addShop,
  updateShop,
  delShop
} = require('../controller/shop')

router.prefix('/shop')

/**
 * @description 增加商品
 */
router.post('/create', async (ctx, next) => {
  console.log(ctx.request.body) // 上线不显示
  const {
    goods_name,
    goods_price,
    goods_parent_id,
    goods_img_url,
    goods_desc
  } = ctx.request.body
  if (goods_name && goods_price && goods_parent_id && goods_img_url && goods_desc) {
    ctx.body = await addShop({
      goods_name,
      goods_price,
      goods_parent_id,
      goods_img_url,
      goods_desc
    })
  } else ctx.body = new ErrorModel(ParameterIsNull)

})

router.get('/shoplist', async (ctx, next) => {
  // console.log(ctx.request.body) 上线不显示
  const {
    goods_parent_id,
    goods_state,
    pageSize,
    pageIndex
  } = ctx.request.query
  console.log('我是获取1ID', goods_parent_id)
  ctx.body = await getShopList({
    goods_parent_id,
    pageSize,
    pageIndex,
    goods_state
  })
})

/**
 * @description 更新商品信息  商品ID 必须的 其他可以为空 不修改
 */
router.post('/update', async (ctx, next) => {
  // console.log(ctx.request.body) 上线不显示
  const { goods_desc,goods_name,goods_parent_id, goods_state, goods_price,  goods_img_url, goods_child_id
  } = ctx.request.body

  console.log('路由获取的商品ID', goods_child_id)
  let newGoods_name = goods_name
  let newGoods_state = goods_state
  let newGoods_parent_id = goods_parent_id
  let newGoods_price = goods_price
  let newGoods_img_url = goods_img_url 
  let newGoods_desc = goods_desc

  if ( goods_child_id ) {
    ctx.body = await updateShop({
      newGoods_name,
      newGoods_state,
      newGoods_parent_id,
      newGoods_price,
      newGoods_img_url,
      newGoods_desc
    }, {
      goods_child_id
    })
  } else {
    ctx.body = new ErrorModel(ParameterIsNull)
  }

})

/**
 * @description 删除商品 商品ID 
 */
router.post('/delete', async (ctx, next) => {
  const { goods_id } = ctx.request.body
  console.log('参数', goods_id)
  if (goods_id) ctx.body = await delShop({ goods_id })
  else ctx.body = new ErrorModel(ParameterIsNull)
})


module.exports = router
