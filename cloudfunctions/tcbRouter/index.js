// 云函数入口文件
const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const app = new tcbRouter({
    event
  });
  //定义公共路由
  app.use(async (ctx,next)=>{
    ctx.data = {text:'commit text'};
    ctx.data.openid = wxContext.openid;
    await next()
  })
  app.router('music',async (ctx,next)=>{
    ctx.data.name = 'music';
    await next();
  },async (ctx,next)=>{
    ctx.data.age = '21';
    ctx.body = {
      data : ctx.data
    }
  })

  app.router('movie',async (ctx,next)=>{
    ctx.data = {
      name:"movie",
      age:"21"
    }
    ctx.body = {data:ctx.data}
  })
  return app.serve()
}