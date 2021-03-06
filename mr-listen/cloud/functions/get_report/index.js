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
exports.main = async () => {
    try {
        const {OPENID} = cloud.getWXContext();
        let reports;
        if (((reports = (await db.collection('report').where({
            userId: OPENID
        }).get()).data) && reports.length)) {
            return {
                code: HttpCode.SUCCESS,
                data: reports[0],
                message: ''
            }
        } else {
            return {
                code: HttpCode.NOT_FOUND,
                data: null,
                message: '您的报告还未产生'
            }
        }
    } catch (e) {
        return {
            code: HttpCode.ERROR,
            data: null,
            message: e.errMsg
        }
    }
};