// 云函数入口文件
const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router');
const rp = require("request-promise")

cloud.init()
const db = cloud.database()
const BASE_URL = "http://musicapi.xiecheng.live"

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  //自动找请求的路由
  const app = new tcbRouter({
    event
  });

 //获取歌单列表
  app.router("playlist",async (ctx,next)=>{
    ctx.data = await db.collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')//排序
      .get()
      .then(res => {
        console.log(res)
        return res
      }).catch(console.error)
    ctx.body = ctx.data
  })

  //获取歌曲列表
  app.router("musiclist",async (ctx,next)=>{
    ctx.body = await rp(BASE_URL+`/playlist/detail?id=${event.playlistId}`)
    .then(res=>{
      return JSON.parse(res)
    })
  })

  //根据音乐id获取音乐播放地址
  app.router('musicUrl', async (ctx,next)=>{
    ctx.body = await rp(BASE_URL+`/song/url?id=${event.musicId}`)
    .then(res=>{
      return res
    })
  })

  //获取歌词
  app.router('lyric',async (ctx,next)=>{
    ctx.body = await rp(BASE_URL+`/lyric?id=${event.musicId}`).then(res=>{
      return res
    })
  })

  return app.serve()
}