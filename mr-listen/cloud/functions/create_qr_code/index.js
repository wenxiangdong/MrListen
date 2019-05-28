// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require("fs");

cloud.init();

const HttpCode = {
  SUCCESS: 0,
  AUTHENTICATION_ERROR: 1,
  NOT_FOUND: 2,
  ERROR: 3
};

// interface HttpResponse<T> {
// code: HttpCode;
// data: T;
// message: string;
// }

// 云函数入口函数
// 参数
// page: string 要跳转的url
// params: object 带的参数
exports.main = async (event, context) => {
  const {page = "pages/index/index", params} = event;

  if (!params) {
    return {
      code: HttpCode.ERROR,
      data: null,
      message: "参数params不存在"
    }
  }

  let scene = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join("&");
  console.log("scene", scene);
  try {
    const options =  {
      page,
      scene,
      isHyaline: true
    };
    console.log(options);

    // 获取二维码内容
    const getCodeRes = await cloud.openapi.wxacode.getUnlimited(options);
    console.log(getCodeRes);


    // 保存到云存储
    const path = `qr_code/${new Date().getTime()}`;
    const uploadFileRes = await cloud.uploadFile({
      cloudPath: path,
      fileContent: getCodeRes.buffer
    });

    return {
      code: HttpCode.SUCCESS,
      data: uploadFileRes.fileID,
      message: ""
    };
  } catch (e) {
    console.error(e);
    return {
      code: HttpCode.ERROR,
      data: null,
      message: e.errMsg
    };
  }
};
