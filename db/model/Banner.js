/**
 * @description 图片
 * @author 爱呵呵
 */


 const seq = require('../seq')
 const { STRING } = require('../type')
 
 // users 
 const Banner = seq.define('banner', {
    imgUrl: {
        type: STRING,
        allowNull: false,
        comment: '图片地址'
    },
    link: {
        type: STRING,
        comment: '图片链接地址'
    },
 })
 
 module.exports = Banner