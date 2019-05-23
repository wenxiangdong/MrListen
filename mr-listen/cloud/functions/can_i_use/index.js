// 云函数入口文件

const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

const HttpCode = {
    SUCCESS: 0,
    AUTHENTICATION_ERROR: 1,
    NOT_FOUND: 2,
    ERROR: 3
};

// 云函数入口函数
exports.main = async (event) => {
    try {
        const key = event.key;
        let uses;
        if (((uses = (await db.collection('use').where({
            key
        }).get()).data) && uses.length)) {
            let use = uses[0];
            return {
                code: HttpCode.SUCCESS,
                data: use.value,
                message: ''
            }
        } else {
            return {
                code: HttpCode.NOT_FOUND,
                data: false,
                message: ''
            }
        }
    } catch (e) {
        return {
            code: HttpCode.ERROR,
            data: false,
            message: e.errMsg
        }
    }
};