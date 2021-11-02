/**
 * @description menu service 端
 * @author 爱呵呵
 */

const { Menu } = require('../db/model')
const { formatData } = require('./_format')

/**
 * 商品分类父级菜单增加
 * @param { string } menu_name 总类名称  
 * @returns 
 */
async function MenuServiceCreate({ menu_name }) {
    const result = await Menu.create({
        menu_name
    })

    return result.dataValues
}

/**
 * 商品分类父级菜单删除
 * @param { number } goods_id 菜单goods_id
 * @returns 
 */
async function MenuServiceDetle({ goods_id }) {
    const whereData = {
        id: goods_id
    }

    const result = await Menu.destroy({
        where: whereData
    })
    console.log(result)
    return result > 0 // 判断修改的行数是否为1
}

/**
 * 商品分类父级菜单更新
 * @param { string } menu_name 
 * @param { number } id 
 * @returns 
 */
async function MenuServiceUpdate({ menu_name, id }) {
    const updateData = {
        menu_name
    }
    const result = await Menu.update(updateData, {
        where: { id }
    })

    console.log('服务端的', result)
    return result > 0
}

/**
 * 获取所有的商品分类父级菜单
 * @returns 
 */
async function MenuServiceFind() {
    const result = await Menu.findAndCountAll({
       order: [['id', 'desc']]
    })

    return formatData(result.rows.map((row) => row.dataValues))
}

module.exports = {
   MenuServiceCreate,
   MenuServiceDetle,
   MenuServiceUpdate,
   MenuServiceFind
}