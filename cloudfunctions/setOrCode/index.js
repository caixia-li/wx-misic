// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: wxContext.OPENID
    })
    // return result //不直接返回，因为返回的是二进制，所以通过云存储将二进制转化为图片
    let code = await cloud.uploadFile({
      cloudPath: `orCode/${Date.now()}-${parseInt(Math.random() * 1000000)}.jpg`,
      fileContent: result.buffer
    })
    return code.fileID

  } catch (err) {
    return err
  }
}