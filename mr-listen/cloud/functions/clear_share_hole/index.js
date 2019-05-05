// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async () => {
    await db.collection('share_hole').where({
        expiryTime: _.gte(0).and(_.lt(db.serverDate())),
    }).remove();
};