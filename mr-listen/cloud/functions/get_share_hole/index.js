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
    // const {} = cloud.getWXContext()
    try {
        const key = event.key;

        let shareHoles;

        if (key && (shareHoles = (await db.collection('share_hole').where({key}).get()).data) && shareHoles.length) {
            let shareHole = shareHoles[0];

            if (shareHole && (shareHole.expiryTime < 0 || new Date(shareHole.expiryTime) > new Date()))
                return {
                    code: HttpCode.SUCCESS,
                    data: shareHole,
                    message: ''
                };
            else return {
                code: HttpCode.NOT_FOUND,
                data: null,
                message: '该分享树洞已过期'
            }
        } else return {
            code: HttpCode.NOT_FOUND,
            data: null,
            message: '未找到该分享树洞'
        }
    } catch (e) {
        return {
            code: HttpCode.NOT_FOUND,
            data: null,
            message: '未找到该分享树洞'
        }
    }
};