// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
const _ = db.command;

const HttpCode = {
    SUCCESS: 0,
    AUTHENTICATION_ERROR: 1,
    NOT_FOUND: 2,
    ERROR: 3
};

// 云函数入口函数
exports.main = async (event) => {
    try {
        const shareHoleId = event.shareHoleId;
        let shareHoleDoc = db.collection('share_hole').doc(shareHoleId);
        await shareHoleDoc.update({
            data: {
                plusOneCount: _.inc(1)
            }
        });
        return {
            code: HttpCode.SUCCESS,
            data: null,
            message: ''
        }
    } catch (e) {
        console.log(e.errMsg);
        return {
            code: HttpCode.ERROR,
            data: null,
            message: e.errMsg
        }
    }
};