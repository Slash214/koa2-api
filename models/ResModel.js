/**
 * @description 数据返回模型
 * @author 爱呵呵
 */


// 基础模块
class BaseModel {
    constructor({ status, data, message,code }) {
        this.status = status
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
        if (code) {
            this.code = code
        }
    }
}

// 成功返回模型
class SuccessModel extends BaseModel {
    constructor({ data = {},  total = 0 }) {
        super({
            status: 'success',
            code: 200,
            data,
            total
        })
    }
}

// 失败返回模型
class ErrorModel extends BaseModel {
    constructor({ code, message }) {
        super({
            state: 'fail',
            code,
            message
        })
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}