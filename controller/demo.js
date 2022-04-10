/**
 * @description demo 演示
 * @author 爱呵呵
 */

const { SuccessModel } = require('../models/ResModel')


class DemoCtl {
    async update (ctx) {
        const item = { msg: '测试' }
        ctx.body = new SuccessModel({ data: item })
    }
    async remove (ctx) {
        const item = { msg: '测试' }
        ctx.body = new SuccessModel({ data: item })
    }
    async getList (ctx) {
        const item = { msg: '测试' }
        ctx.body = new SuccessModel({ data: item })
    }
    async create (ctx) {
        const item = { msg: '测试' }
        ctx.body = new SuccessModel({ data: item })
    }
}

module.exports = new DemoCtl()