/**
 * @description menu service 端
 * @author 爱呵呵
 */

 const { Goods } = require('../db/model')
 const { formatData } = require('./_format')

/**
 * 增加商品
 * @param { string } goods_name 商品名称  
 * @param { string } goods_price 商品价格  单价
 * @param { number } goods_state 商品状态  
 * @param { number } goods_parent_id 商品父级菜单ID  
 * @param { string } goods_img_url 商品图片  
 * @param { string } goods_desc 商品介绍  
 * @returns 
 */
async function ServiceShopAdd ({ goods_desc,goods_img_url,goods_name,goods_price, goods_parent_id }) {

    const result = await Goods.create({
        goods_name,
        goods_price,
        goods_parent_id,
        goods_img_url,
        goods_desc
    })
    // console.log(result)
    return result.dataValues
}
 
/**
 * 更新商品信息 
 * @param { string } goods_name  商品名称
 * @param { number } goods_state 商品状态 1 正常  0 下架
 * @param { number } goods_parent_id  商品父级菜单ID
 * @param { string } goods_picre  商品价格
 * @param { string } goods_img_url  商品图片
 * @param { number } goods_child_id  商品ID
 * @returns 
 */
async function ServiceShopUpdate(
    { newGoods_desc,newGoods_name, newGoods_state, newGoods_parent_id, newGoods_price, newGoods_img_url },
    { goods_child_id }
) {
    console.log('我是商品的ID', goods_child_id)
    // 更新内容
    const updateData = {
        goods_name: newGoods_name,
        goods_state: newGoods_state,
        goods_parent_id: newGoods_parent_id,
        goods_price: newGoods_price,
        goods_img_url: newGoods_img_url,
        goods_desc: newGoods_desc
    }

    // 比较查询的 数据
    if (newGoods_name) { updateData.goods_name = newGoods_name}
    if ( +newGoods_state === 1 || +newGoods_state === 0 ) {updateData.goods_state = newGoods_state}
    if (newGoods_parent_id) {updateData.goods_parent_id = newGoods_parent_id}
    if (newGoods_price) { updateData.goods_price = newGoods_price}
    if (newGoods_img_url) {updateData.goods_img_url = newGoods_img_url}
    if (newGoods_desc) {updateData.goods_desc = newGoods_desc}
 
    const whereData = {
        id: goods_child_id
    }

    console.log(whereData)
    console.log("当前修改的数据", updateData)
    const result = await Goods.update(updateData, {
        where: whereData
    })

    console.log('当前返回的结果', result)
    return result[0] > 0 // 判断修改的行数是否为1
}
 
/**
 * 获取商品列表 如果有菜单ID获取菜单列表 默认没有获取推荐热门商品
 * @param { number } goods_parent_id 父级菜单ID 默认没有获取所有商品
 * @param { number } pageSize 一页显示多少 默认 20
 * @param { number } pageIndex 第几页 默认 第一页 
 * @returns 
 */
 async function ServiceGetShop({ goods_parent_id = 0, pageSize = 20 , pageIndex = 0, goods_state }) {
    const whereData = {}
    if (goods_parent_id) {
        whereData['goods_parent_id'] = goods_parent_id
    }

    if (goods_state) {
        whereData['goods_state'] = goods_state
    }
    pageIndex = pageIndex ? pageIndex - 1 : pageIndex;

    const result = await Goods.findAndCountAll({
        limit: parseInt(pageSize), // 每一页多少条
        offset: pageSize * pageIndex, // 跳过多少条
        where: whereData,
        order: [['id', 'desc']]
    })
 
    const item = formatData(result.rows.map((row) => row.dataValues))
    const total = result.count
    return { item, total }
 }
 
 /**
  * 删除商品，需要商品的ID
  * @param { number } goods_id 商品id 
  * @returns result 大于 0 删除成功
  */ 
 async function ServiceDeleteShop({ goods_id }) {
    const result = await Goods.destroy({
        where: { id: goods_id }
    })

    return result
 }

 module.exports = {
    ServiceShopUpdate,
    ServiceShopAdd,
    ServiceGetShop,
    ServiceDeleteShop
 }