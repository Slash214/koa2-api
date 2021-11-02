/**
 * @description shop controller  (业务信息)
 * @auther 爱呵呵
 */

const { ErrorModel, SuccessModel } = require("../models/ResModel");
const { ServiceShopUpdate, ServiceGetShop, ServiceShopAdd, ServiceDeleteShop } = require("../services/shop");
const { UpdateInfoFail, SQLDetailFail } = require("../models/ErrorInfo");

/**
 * 获取商品列表 默认获取所有商品，传ID获取分类商品
 * @param { number } goods_parent_id 父级ID
 * @param { number } pageSize 默认20
 * @param { number } pageIndex 页
 * @returns 
 */
async function getShopList({ pageIndex, pageSize, goods_parent_id, goods_state  }) {
    const { item, total } = await ServiceGetShop({ pageIndex, pageSize, goods_parent_id, goods_state  })
    
    if (total) {
        return {
            state: 'success',
            data: item,
            total: total,
            code: 200
        };
    } else return new SuccessModel(item)
}

/**
 * 增加商品
 * @param { string } goods_name   商品名称
 * @param { string } goods_price  商品价格
 * @param { number } goods_state 商品状态
 * @param { number } goods_parent_id 父级商品ID
 * @param { string } goods_img_url 商品图片
 * @returns 
 */
async function addShop({ goods_desc, goods_name, goods_price, goods_state, goods_parent_id, goods_img_url }) {
    const item = await ServiceShopAdd({ 
        goods_name, 
        goods_price, 
        goods_state, 
        goods_parent_id,
        goods_img_url,
        goods_desc
    })
    console.log(item) 
    if (item) {
        return new SuccessModel('增加成功')
    } else return new ErrorModel('失败')
    
}


/**
 * @description 更新商品状态  goods_state 更新就是商品的下架，0
 * @param { string } newGoods_name 商品 新名称
 * @param { number } newGoods_state 商品 新状态
 * @param { number } newGoods_parent_id  商品 新父级ID 这里可不传 默认不改变
 * @param { string } newGoods_price   商品 新价格
 * @param { string } newGoods_img_url 商品 新图片
 * @param { number } goods_child_id  商品ID 不变
 * @param { number } newGoods_desc  商品新描述 
 * @returns 
 */
async function updateShop({ 
    newGoods_name, 
    newGoods_state,
    newGoods_parent_id,
    newGoods_price, 
    newGoods_img_url,
    newGoods_desc }, { goods_child_id }) {
    console.log('我是控制器的商品ID', goods_child_id)    
    const item = await ServiceShopUpdate(
        { newGoods_name, newGoods_desc, newGoods_state, newGoods_parent_id, newGoods_price, newGoods_img_url },
        { goods_child_id }
        )

    console.log('我是修改的', item)    
    if (item) {
        return new SuccessModel('修改成功')
    } else return new ErrorModel(UpdateInfoFail)
    
}

/**
 * 删除商品 需要商品的ID
 * @param { number } goods_id
 * @returns 
 */
async function delShop({ goods_id }) {
    const item = await ServiceDeleteShop({ goods_id })
    if (item > 0) return new SuccessModel('删除成功')
    else return new ErrorModel(SQLDetailFail)
}

module.exports = {
    getShopList,
    addShop,
    updateShop,
    delShop
};
  