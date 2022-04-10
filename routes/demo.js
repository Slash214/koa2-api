const router = require('koa-router')()

const { update, remove, getList, create } = require('../controller/demo')

router.prefix('/demo')

router.get('/list', getList)
router.post('/add', create)
router.put('/xg', update)
router.get('/del', remove)

module.exports = router