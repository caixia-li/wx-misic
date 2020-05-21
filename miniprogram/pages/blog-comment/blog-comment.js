import formaTime from "../../utils/formatTime.js"
Page({
  data: {
    blog:{},
    commentList:[]
  },
  onLoad: function (options) {
    this.getBlogDetail(options.blogId)
  },
  getBlogDetail(blogId){
    blogId = blogId
    wx.showLoading({
      title: '加载中..',
    })
    wx.cloud.callFunction({
      name:"blog",
      data:{
        blogId,
        $url:"detail"
      }
    }).then(res=>{
      wx.hideLoading();
      let commentList = res.result.commentList.data
      commentList.forEach(item=>{
        item.createTime = formaTime(new Date(item.createTime))
      })
      this.setData({
        blog:res.result.detail.data[0],
        commentList: res.result.commentList.data
      })
    })
  },
  getBlogDetailComment(event){
    this.getBlogDetail(event.detail.blogId)
  },
  onShareAppMessage: function (event) {
    let blog = this.data.blog.context
    let blogId = event.target.dataset.blogid
    return {
      title: blog.context,
      path: `/pages/blog-comment/blog-comment?blogId=${blogId}`
    }
  }

})