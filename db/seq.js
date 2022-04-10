/**
 * @description sequelize 实例
 * @author 爱呵呵
 */

const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../conf/db')
const { isTest, isProd } = require('../utils/env')

const { host, user, password, database } = MYSQL_CONF
// 本地连接不适合上线使用
const conf = {
    host,
    dialect: 'mysql',
    timezone: '+08:00'
}

// 让日志不打印出来
if (isTest) {
    conf.logging = () => {}
}

// 线上环境 使用 连接池
if (isProd) {
    conf.pool = {
        max: 5, // 连接池最大连接数量
        min: 0, // 最小
        idle: 10000 // 如果一个连接池 10 s 没有被使用 就被释放
    }
}

console.log(conf)
const seq = new Sequelize(database, user, password, conf)
// 后面依次是 数据库名称 和 账号名 密码

module.exports = seq