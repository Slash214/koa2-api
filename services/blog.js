/**
 * @description blog service 端
 * @author 爱呵呵
 */

const { List, Detail } = require("../db/model/");
const { formatBlog, formatTotal } = require("./_format");
const { Op } = require("../db/type");


async function getFLiitem({type, pageSize = 20 , pageIndex = 0}) {
  const whereOpt = {
    type
  } 

  pageIndex = pageIndex ? pageIndex - 1 : pageIndex;

  const result = await List.findAndCountAll({
    limit: parseInt(pageSize), // 每一页多少条
    offset: pageSize * pageIndex, // 跳过多少条
    order: [["id", "desc"]],
    where: whereOpt
  })

  let blogList = result.rows.map((row) => row.dataValues);
  const item = formatBlog(blogList);
  const total = result.count;
  return {
    total,
    item,
  };
}


/**
 * 
 * @param {*} fid 详情id 
 */
async function getDetialItem(fid) {
  const whereOpt = {
    fid,
  };

  const result = await Detail.findOne({
    where: whereOpt,
  });

  if (result == null) {
    // 不存在
    return result;
  }
  // console.info(result.dataValues)
  let DEtialList = result.dataValues;
  const item = formatBlog(DEtialList);
  // console.info(item)
  return item;
}

/**
 *
 * @param {Object} param0 资源详情列表增加
 * fid 父级ID
 */
async function xqcreateList({ content, baidu, cloud, lzy, image, fid, gf }) {
  const result = await Detail.create({
    fid,
    content,
    image,
    baidu,
    cloud,
    lzy,
    gf,
  });

  return result.dataValues;
}


/**
 * 
 * @param {*} param0 详情 更新的参数  
 * @param {*} param1 详情 更新的条件  fid 是 文章ID 更新 指定文章
 */
async function UpdateDetail(
  { newImage , newContet, newGf, newCloud, newLzy , newBaidu },
  { fid }
){
    // 拼接修改内容
    const updateData = {
      image: newImage,
      content: newContet,
      gf: newGf,
      cloud: newCloud,
      lzy: newLzy,
      baidu: newBaidu
    }

    // console.log(c )

      // 拼接查询条件
    const whereData = {
      fid
    }

    const result = await Detail.update(updateData,{
      where: whereData
    })
  
    return result[0] > 0 // 判断修改的行数是否为1
}


/**
 * 
 * @param {*} param0 更新的参数 newTitle, newImage , newType, newContet, newLabel, newAuthor, newFlag
 * @param {*} param1 更新的条件
 */
async function updateItem(
  { newTitle, newImage , newType, newContet, newLabel, newAuthor, newFlag},
  { id }
) {
  
  // 拼接修改内容
  const updateData = {
    title: newTitle,
    image: newImage,
    type: newType,
    content: newContet,
    label: newLabel,
    author: newAuthor,
    flag: newFlag
  }

   // 比较查询的 数据
  // if (newTitle) { updateData.title = newTitle}
  // if (newImage) {updateData.image = newImage}
  // if (newType) {updateData.type = newType}
  // if (newContet) { updateData.content = newContet}
  // if (newLabel) {updateData.label = newLabel}
  // if (newAuthor) { updateData.author = newAuthor}
  // if (newFlag) { updateData.flag = newFlag}

  // 拼接查询条件
  const whereData = {
    id
  }

  const result = await List.update(updateData,{
    where: whereData
  })

  return result[0] > 0 // 判断修改的行数是否为1
}


/**
 * 列表资源增加
 * @param {Object} param0 创建列表的数据 { title content， image}
 */
async function createList({
  title,
  content,
  image,
  author = "爱呵呵",
  type,
  label
}) {
  const result = await List.create({
    title,
    content,
    image,
    author,
    type,
    label
  });
  return result.dataValues;
}

/**
 * 获取资源列表
 * @param {*} query (关键词) pageSiez 数量  pageIndex 页数
 */
async function getItemData({ query = "", pageIndex = 0, pageSize = 20 }) {
  // 查询条件 -- 模糊查询
  pageIndex = pageIndex ? pageIndex - 1 : pageIndex;
  // console.info(pageIndex);
  const whereOpt = {
    content: {
      [Op.like]: "%" + query + "%",
    },
  };

  const result = await List.findAndCountAll({
    limit: parseInt(pageSize), // 每一页多少条
    offset: pageSize * pageIndex, // 跳过多少条
    order: [["id", "desc"]],
    attributes: [
      "id",
      "title",
      "image",
      "content",
      "type",
      "label",
      "author",
      "flag",
      "cardimg",
      "createdAt",
      "updatedAt",
    ],
    where: whereOpt,
    // result.count 总数 与分页无关
    // result.row 查询结果 数组
  });

  let blogList = result.rows.map((row) => row.dataValues);
  const item = formatBlog(blogList);
  const total = result.count;
  return {
    total,
    item,
  };
}


/**
 * 获取首页的数据
 */
async function ServiceIndexList({ pageSize = 15, pageIndex = 0 }) {
  // 查询条件 
  pageIndex = pageIndex ? pageIndex - 1 : pageIndex
  const result = await List.findAndCountAll({
    limit: +pageSize,  // 每一页多少条
    offset: +pageSize * +pageIndex,  // 跳过多少条
    order: [['id', 'desc']]
  })
  // result.count 总数 与分页无关
  // result.row 查询结果 数组

  let IndexList = result.rows.map((row) => row.dataValues)
  const item = formatBlog(IndexList)
  return item
}


module.exports = {
  getItemData,
  createList,
  xqcreateList,
  getDetialItem,
  getFLiitem,
  updateItem,
  UpdateDetail,
  ServiceIndexList
};
