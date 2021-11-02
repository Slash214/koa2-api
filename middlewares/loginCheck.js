/**
 * @description 登录验证接口
 * @author 爱呵呵
 */

const { ErrorModel } = require('../models/ResModel')
const { TokenFailure, TokenNotNull } = require('../models/ErrorInfo')
const jwt = require('jsonwebtoken')
const { Token_Config } = require('../conf/secreKey')

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
        if (token) {
            // let token = token
            // 如果有token的话就开始解析  去掉自己添加的 ahh 字符串
            const tokenItem = jwt.verify(token.replace("ahh", ""), Token_Config.privateKey)
            // 将token的创建的时间和过期时间结构出来
            console.log(tokenItem)
            // exp：到期时间   --timeout 
            // iat：发布时间   --time   
            const { iat, exp } = tokenItem
            
            console.log("时间转换比较:", tamp(Date.parse(new Date()).toString()))
            
            // 拿到当前的时间 并转为 10 位时间戳格式比较
            let data = tamp(Date.parse(new Date()).toString());
            console.info(data)
            // 判断一下如果当前时间减去token创建时间小于或者等于token过期时间，说明还没有过期，否则过期
            if (data - iat <= exp) {
                
                // token没有过期
                await next()
            } else {
                // console.log("我进入错误的逻辑了")
                ctx.body = new ErrorModel(TokenFailure)
            }
        } else {
            ctx.body = new ErrorModel(TokenNotNull)
        }
    }
    // if (ctx.session && ctx.session.userInfo) {
    //     // 已登录
    //     await next()
    //     return
    // }

    // // 未登录
    // ctx.body = new ErrorModel('未登录')
    /**
     * iss (issuer)：签发人
        exp (expiration time)：过期时间
        sub (subject)：主题
        aud (audience)：受众
        nbf (Not Before)：生效时间
        iat (Issued At)：签发时间
        jti (JWT ID)：编号
     */
}



module.exports = loginCheck