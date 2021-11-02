const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const path = require('path')
const { SESSION_SECRET_KEY } = require('./conf/secreKey')
const cors = require('koa2-cors')
const config = require('./config')

const port = process.env.PORT || config.port

// 允许跨域
app.use(cors())

// test

//token验证
// app.use(loginCheck)

// 路由
const IndexRouter = require('./routes/index')
const MenuRouter = require('./routes/menu')
const ShopRouter = require('./routes/shop')
const WechatRouter = require('./routes/wechat')
const AdminRouter = require('./routes/admin')

/** 404 */
const NoPageRouter= require('./routes/404')

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
    .use(json())
    .use(logger())
    .use(require('koa-static')(__dirname + '/public'))
    .use(views(path.join(__dirname, '/views'), {
        options: { settings: { views: path.join(__dirname, 'views') } },
        map: { 'njk': 'nunjucks' },
        extension: 'njk'
    }))


// session 配置
app.keys = [SESSION_SECRET_KEY]
app.use(session({
    key: 'blog.sid',
    prefix: 'blog.sid',
    token: 1,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 21 * 60 * 60 * 1000
    }
}))

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - $ms`)
})

// router 注册
app.use(IndexRouter.routes(), IndexRouter.allowedMethods())
app.use(ShopRouter.routes(), ShopRouter.allowedMethods())
app.use(MenuRouter.routes(), MenuRouter.allowedMethods())
app.use(WechatRouter.routes(), WechatRouter.allowedMethods())
app.use(AdminRouter.routes(), AdminRouter.allowedMethods())

/**404 */
app.use(NoPageRouter.routes(), NoPageRouter.allowedMethods())



app.on('error', function(err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`)
})