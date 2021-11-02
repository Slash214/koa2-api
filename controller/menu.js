/**
 * @description menu controller  (业务信息)
 * @auther 爱呵呵
 */

 const { ErrorModel, SuccessModel } = require("../models/ResModel");
 const { MenuServiceCreate, 
         MenuServiceFind,
         MenuServiceDetle,
         MenuServiceUpdate } = require("../services/menu");
 const { MenuCreateFail, UpdateInfoFail, SQLDetailFail } = require("../models/ErrorInfo");
 
async function MenuCreate({ menu_name }) {
  try {
    const result = await MenuServiceCreate({ menu_name })
    if (result) {
        console.log('增加成功', result)
    }
    return new SuccessModel('增加成功') 
  } catch (ex) {
    console.log(ex.message, ex.stack);
    return new ErrorModel(MenuCreateFail)   
  }
}

async function MenuGetAll() {
    const result = await MenuServiceFind()
    return new SuccessModel(result)
}

async function MenuDetel({ goods_id }) {
    const result = await MenuServiceDetle({ goods_id })
    console.log(result)
    if (result) {
        return new SuccessModel('删除成功')
    } else return new ErrorModel(SQLDetailFail)
}

async function MenUpdate({ menu_name, id }) {
  const result = await MenuServiceUpdate({ menu_name, id })
  // console.log('更新的结果', result)
  if (result) {
    return new SuccessModel('修改成功')
  } else return new ErrorModel(UpdateInfoFail)
} 

 module.exports = {
    MenuCreate,
    MenuGetAll,
    MenuDetel,
    MenUpdate
 };
   