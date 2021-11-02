/**
 * @description blog controller  (业务信息)
 * @auther 爱呵呵
 *
 */

const { ErrorModel, SuccessModel } = require("../models/ResModel");
const {
  getItemData,
  createList,
  xqcreateList,
  getDetialItem,
  getFLiitem,
  updateItem,UpdateDetail,
  ServiceIndexList
} = require("../services/blog");
const { createError,updateFailure } = require("../models/ErrorInfo");


/**
 * 
 * @param {*} param0 更新 Detail 详情 数据
 * CMS 详情更新  需要 文章ID fid 就是
 */
async function DetailUpdate(
  { fid, newImage , newContet, newGf, newCloud, newLzy , newBaidu}
) {
  try{
    const list = await UpdateDetail(
      {
        newImage , newContet, newGf, newCloud, newLzy , newBaidu
      },
      { fid }
    )
    if (list) {
    //   console.log("详情修改成功") 上线不显示
      return new SuccessModel(list);
    } else return new ErrorModel(updateFailure);
  }
  catch(ex) {
    console.error(ex.message, ex.stack);
    return new ErrorModel(updateFailure);
  }
}

/**
 * 
 * @param {*} param0 更新 List 数据
 * cms 的更新 List 数据 
 */
async function updateList(
  { id, newTitle, newImage , newType, newContet, newLabel, newAuthor, newFlag,newCardimg }
) {
  try{
    const list = await updateItem(
      {
        newTitle, newImage , newType, newContet, newLabel, newAuthor, newFlag,newCardimg
      },
      { id }
    )
    if (list) {
      // console.log("修改成功")
      return new SuccessModel(list);
    }
  } catch (ex) {
    console.error(ex.message, ex.stack);
    return new ErrorModel(updateFailure);
  }
}



// 获取分类列表数据  type 判断 电脑资源or 手机资源
async function getFLlist({type, pageSize, pageIndex}) {
   const {item, total} = await getFLiitem({type, pageIndex, pageSize}) 
   if (total) {
     return {
      state: 'success',
      data: item,
      total: total,
      code: 200
     }
   } else {
    return new SuccessModel(item)
   }
}


// 列表数据详情获取
async function getDetail(fid) {
  const item = await getDetialItem(fid);
  return new SuccessModel(item);
}

// 详情增加
async function xqcreate({ content, baidu, cloud, lzy, image, fid, gf }) {
  try {
    // 详情资源创建
    const list = await xqcreateList({
      fid,
      content,
      image,
      baidu,
      cloud,
      lzy,
      gf
    });
    // console.info(list); 上线不显示
    // 返回
    return new SuccessModel(list);
  } catch (ex) {
    console.error(ex.message, ex.stack);
    return new ErrorModel(createError);
  }
}

async function create({ title, content, image, author, type, label }) {
  try {
    // 创建资源列表
    const list = await createList({
      title,
      image,
      type,
      content,
      label,
      author,
    });
    // console.info(list);
    // 返回
    return new SuccessModel(list);
  } catch (ex) {
    console.error(ex.message, ex.stack);
    return new ErrorModel(createError);
  }
}

/**
 * 资源列表
 * @param {string} query 搜索参数
 */
async function getList({ query, pageIndex, pageSize }) {
  const { item, total } = await getItemData({
    query,
    pageIndex,
    pageSize,
  });
  if (total) {
    return {
      state: 'success',
      data: item,
      total: total,
      code: 200
    };
  } else {
    return new SuccessModel(item);
  }
}


/**
 * 获取首页的List 列表数据 默认是全部的 可以懒加载  需要pageSize 页数 和 pageIndex
 */
async function getIndexlist({ pageIndex, pageSize }) {
  const item = await ServiceIndexList({ pageIndex, pageSize })
  return new SuccessModel(item)
}

module.exports = {
  getList,
  create,
  xqcreate,
  getDetail,
  getFLlist,
  updateList,
  DetailUpdate,
  getIndexlist
};
