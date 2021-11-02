/**
 * @description 登录验证接口
 * @author 爱呵呵
 */

const { ErrorModel } = require('../models/ResModel')
const { TokenFailure, TokenNotNull } = require('../models/ErrorInfo')
const jwt = require('jsonwebtoken')
const { CustomenToken } = require('../conf/secreKey')

function tamp(time) {
    return time.substr(0, 10);
}

async function loginCheck(ctx, next) {
    let url = ctx.url.split('?')[0]  
    // console.info("解析了的url", url)
    if (url === '/api/user/login' || url === '/api/user/register') {
        await next()
    } else {
        let token = ctx.request.headers["ahh-token"]
        if (token === CustomenToken) {
           // 自定义 常能 假装判断  
           await next()
        } else {
            ctx.body = new ErrorModel(TokenNotNull)
        }
    }
}



module.exports = loginCheck