// 云函数入口文件
const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router')

cloud.init()
let db = cloud.database()
let blogCollection = db.collection('blog')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({
    event
  })
  app.router('list', async (ctx, next) => {
    // 分页查询，从第一个索引值开始 查询多少条数据
    const {
      keyword,
      start,
      count
    } = event
    let w = {}
    if (keyword.trim() != '') {
      w = {
        context: db.RegExp({
          regexp: keyword,
          opions: 'i'
        })
      }
    }
    let bloglist = await blogCollection.skip(event.start)
      .where(w)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res.data
      })
    ctx.body = bloglist
  })

  //详情
  app.router('detail', async (ctx, next) => {
    let detail = await db.collection('blog')
      .where({
        _id: event.blogId
      })
      .get(res => {
        return res.data
      })
    //评论信息
    let countResult = await db.collection('blog-comment').count();
    let total = countResult.total;
    let commentList = {
      data: []
    }
    let tasks = []
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT);
      for (var i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment')
          .where({
            blogId:event.blogId
          })
          .skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT)
          .orderBy('createTime', 'desc')
          .get()
        tasks.push(promise)
      }
    }
    if(tasks.length>0){
      commentList = (await Promise.all(tasks)).reduce((acc,cur)=>{
        return {
          data:acc.data.concat(cur.data)
        }
      })
    }
    ctx.body = {
      detail,
      commentList
    }
  })

  //获取我的发布
  const wxContext = cloud.getWXContext()
  app.router('getProfileBlogList',async (ctx,next)=>{
    ctx.body = await db.collection('blog')
    .where({
      _openid:wxContext.OPENID
    })
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then(res=>{
      return res.data
    })
  })

  return app.serve();
}