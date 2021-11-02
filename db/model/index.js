/**
 * @description 数据模型入口文件
 * @author 爱呵呵
 */

const Admin = require('./Admin')
const Banner = require('./Banner')
const Goods = require('./Good')
const Menu = require('./Menu')
const User = require('./User')
const Order = require('./Order')
const Address = require('./Address')

module.exports = {
    Admin,
    Banner,
    Goods,
    Menu,
    Order,
    User,
    Address,
}