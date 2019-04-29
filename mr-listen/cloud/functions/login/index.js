const cloud = require('wx-server-sdk');

cloud.init();

cloud.database().serverDate();


exports.main = async () => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID
  }
};
