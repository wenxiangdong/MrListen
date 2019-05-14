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
        const shareHoleId = event.shareHoleId;

        let shareHole;

        if ((shareHole = (await db.collection('share_hole').doc(shareHoleId).get()).data)) {
            if (shareHole.expiryTime > db.serverDate())
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
        }
    } catch (e) {
        return {
            code: HttpCode.NOT_FOUND,
            data: null,
            message: '未找到该分享树洞'
        }
    }
};