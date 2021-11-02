/**
 * @description 地址信息表
 * @author Joshua
 */

 const seq = require('../seq')
 const {
   STRING,
   INTEGER
 } = require('../type')
 
 const Address = seq.define('address', {
   user_id: {
    type: INTEGER,
    allowNull: false,
    comment: '用户ID'
   },
   phone: {
    type: STRING,
    allowNull: false,
    comment: '电话'
   },
   desc: {
    type: STRING,
    comment: '描述信息'
   },
   isdefault: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 2,
    comment: '默认地址 1为true 2 为false'
   }
 
 })
 
 module.exports = Address
 