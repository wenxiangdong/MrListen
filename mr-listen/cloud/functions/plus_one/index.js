// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
    try {
        const shareHoleId = event.shareHoleId;
        let shareHole = db.collection('share_hole').doc(shareHoleId);
        if (shareHole) {
            shareHole.update({
                data: {
                    plusOneCount: shareHole.get().data.plusOneCount + 1
                }
            })
        }
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