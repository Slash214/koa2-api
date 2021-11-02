/**
 * @author 爱呵呵
 * @description 首页进入的路由
 */

const router = require('koa-router')()

router.get('/', async(ctx, next) => {
    ctx.body = 'WELCOME'
    ctx.state = {
        title: 'Joshua Yang'
    }
    await ctx.render('index', ctx.state)
})

module.exports = router