/**
 * @description 商品分类菜单
 * @author 爱呵呵
 */


 const seq = require('../seq')
 const { STRING } = require('../type')
 
 // users 
 const Menu = seq.define('menu', {
    menu_name: {
        type: STRING,
        allowNull: false,
        unique: true,
        comment: '商品父类名称'
    },
 })
 
 module.exports = Menu