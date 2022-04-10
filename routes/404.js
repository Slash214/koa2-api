/**
 * @author 爱呵呵
 * @description 404 路由
 */

const router = require('koa-router')()
const { NoPageRouter } = require('../models/ErrorInfo')
const { ErrorModel } = require('../models/ResModel')

router.get('('*')', async (ctx, next) => {
  ctx.body = '404'
  ctx.body = new ErrorModel(NoPageRouter)
})



module.exports = router
