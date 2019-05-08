const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

const HttpCode = {
  SUCCESS: 0,
  AUTHENTICATION_ERROR: 1,
  NOT_FOUND: 2,
  ERROR: 3
};


exports.main = async() => {
  const {
    OPENID
  } = cloud.getWXContext();
  try {
    let userCollection = db.collection('user');

    let users;

    if ((users = (await userCollection.where({
        openid: OPENID
      }).get()).data) && users.length) {
      return {
        code: HttpCode.SUCCESS,
        data: users[0]._id,
        message: ''
      }
    } else {
      return {
        code: HttpCode.SUCCESS,
        data: (await userCollection.add({
          data: {
            openid: OPENID,
            createTime: db.serverDate()
          }
        }))._id,
        message: ''
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