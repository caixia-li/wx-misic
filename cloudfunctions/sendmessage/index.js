// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const { OPENID } = cloud.getWXContext()
    //使用云调用订阅方法
    let result = cloud.openapi.subscribeMessage.send({
      "touser": OPENID,
      "page": "/pages/blog-comment/blog-comment?blogId=" + event.blogId,
      "data": {
        //key值与后台一致
        thing1: {
          value: event.nickName
        },
        thing3: {
          value: event.content
        }
      },
      "templateId": "I1dfJHIO5HYgVS_EokyH9OP5kgvgn5IJHttUFh5sUA4",
      "miniprogramState": "developer",
      // "formId": event.formId
    })
  }catch(e){
    console.log(e)
  }
  return result
}