const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

const HttpCode = {
    SUCCESS: 0,
    AUTHENTICATION_ERROR: 1,
    NOT_FOUND: 2,
    ERROR: 3
};


exports.main = async () => {
    const {OPENID} = cloud.getWXContext();
    try {
        let userCollection = db.collection('user');

        let user;

        if ((user = userCollection.doc(OPENID))) {
            return {
                code: HttpCode.SUCCESS,
                data: user._id,
                message: ''
            }
        } else {
            return {
                code: HttpCode.SUCCESS,
                data: await userCollection.add({
                    data: {
                        openid: OPENID,
                        createTime: db.serverDate()
                    }
                })._id,
                message: ''
            }
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
