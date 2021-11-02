/**
 * @description 商品分类路由
 * @author 爱呵呵
*/

const router = require('koa-router')()
const { MenuCreate, MenuGetAll, MenuDetel, MenUpdate } = require('../controller/menu')
const { ErrorModel } = require('../models/ResModel')
const { ParameterIsNull } = require('../models/ErrorInfo')
router.prefix('/menu')

/**
 * @description 增加商品分类
 */

router.post('/create', async (ctx, next) => {
    const { menu_name } = ctx.request.body
    if (!menu_name) {
        ctx.body =  new ErrorModel(ParameterIsNull)
    } else {
        ctx.body = await MenuCreate({ menu_name })
    }
})

router.get('/type', async (ctx, next) => {
    ctx.body = await MenuGetAll()
})


router.post('/delete', async (ctx, next) => {
    const { goods_id } = ctx.request.body
    if (!goods_id) {
        ctx.body =  new ErrorModel(ParameterIsNull)
    } else {
        ctx.body = await MenuDetel({ goods_id })
    }
})

router.post('/update', async (ctx, next) => {
    const { menu_name, id } = ctx.request.body
    if (!menu_name || !id) {
        ctx.body = new ErrorModel(ParameterIsNull)
        return
    }

    ctx.body = await MenUpdate({ menu_name,id })
})

module.exports = router