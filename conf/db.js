/**
 * @description 存储配置
 * @author 爱呵呵
 */

// const { isProd } = require('../utils/env.js')
 
// 配置线上的mysql
// let MYSQL_CONF = {
//     host: '47.100.249.55',
//     user: 'lovehehe',
//     password: 'jbGentJPESkHmGcj',
//     port: '3306',
//     database: 'xcx'
// }

let MYSQL_CONF = {
    host: '127.0.0.1',
    user: 'root',
    password: 'lovehehe',
    port: '3306',
    database: 'yang'
}

module.exports = {
    MYSQL_CONF
}