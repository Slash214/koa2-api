/**
 * @description 订单信息表
 * @author Joshua
 */

const seq = require('../seq')
const {
  STRING,
  INTEGER
} = require('../type')

const Order = seq.define('order', {
  user_id: {
    type: INTEGER,
    allowNull: false,
    comment: '用户ID'
  },
  order_address: {
    type: STRING,
    allowNull: false,
    comment: '订单地址'
  },
  phone: {
    type: STRING,
    allowNull: false,
    comment: '手机号'
  },
  order_number: {
    type: STRING,
    allowNull: false,
    comment: '订单号'
  },
  order_info: {
    type: STRING,
    allowNull: false,
    comment: '订单信息'
  },
  order_total: {
    type: STRING,
    allowNull: false,
    comment: '订单总价'
  },
  order_remake: {
    type: STRING,
    comment: '备注信息'
  }

})

module.exports = Order
