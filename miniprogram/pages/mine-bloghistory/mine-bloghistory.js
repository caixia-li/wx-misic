const MAX_LIMIT = 10;
const db = wx.cloud.database();
const app = getApp();
let total = -1;
Page({
  data: {
    blogList:[],
    isTouchBottom:false
  },
  onLoad: function (options) {
    db.collection('blog').where({
      _openid: app.globalData.openid
    }).count().then(res=>{
      total = res.total
    })
    this.getProfileBlogList()
  },
  //通过openid获取个人博客
  getProfileBlogList(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        "$url": "getProfileBlogList",
        "start": this.data.blogList.length,
        "count": MAX_LIMIT
      }
    }).then(res=>{
      wx.hideLoading();
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
    })
  },
  goComment(event) {
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${event.currentTarget.dataset._id}`,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList:[],
      isTouchBottom:false
    })
    this.getProfileBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.blogList.length == total){
      this.setData({
        isTouchBottom:true
      })
    }else{
      this.getProfileBlogList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    let blog = event.target.dataset.blog
    let blogId = event.target.dataset.blogid
    return {
      title: blog.context,
      path: `/pages/blog-comment/blog-comment?blogId=${blogId}`
    }
  }
})