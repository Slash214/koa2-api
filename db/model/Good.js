/**
 * @description 商品
 * @author 爱呵呵
 */


const seq = require('../seq')
const {
  STRING,
  INTEGER
} = require('../type')

// users 
const Goods = seq.define('good', {
  goods_name: {
    type: STRING,
    allowNull: false,
    comment: '商品名称'
  },
  goods_desc: {
    type: STRING,
    allowNull: false,
    comment: '商品介绍'
  },
  goods_price: {
    type: STRING,
    allowNull: false,
    comment: '商品价格'
  },
  goods_state: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '商品状态 1 正常  0 下架'
  },
  goods_parent_id: {
    type: INTEGER,
    allowNull: false,
    comment: '父级菜单ID'
  },
  goods_img_url: {
    type: STRING,
    comment: '商品图片'
  }
})

module.exports = Goods
