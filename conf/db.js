/**
 * @description 存储配置
 * @author 爱呵呵
 */

const { isProd } = require('../utils/env.js')
let MYSQL_CONF = {}

if (isProd) {
    MYSQL_CONF = {
        host: '',  
        user: '',
        password: '',
        port: '',
        database: ''
    }
} else {
    MYSQL_CONF = {
        host: '127.0.0.1',
        user: 'root',
        password: 'lovehehe',
        port: '3306',
        database: 'yang'
    }
}
module.exports = {
    MYSQL_CONF
}