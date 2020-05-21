let keyword = ''
const db = wx.cloud.database()
let total = 0
Page({
  data: {
    isBottomModalShow: false, //控制底部弹出框显示隐藏
    blogList:[],//博客列表
    isLoading:false,
    isList:true,
  },
  //发布功能
  onPublish() {
    //点击显示底部弹出层
    // this.setData({
    //   isBottomModalShow:true
    // })
    //判断用户是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.onloginSuccess({
                detail:res
              })
            }
          })
        } else {
          //没有授权弹出底部弹出层获取用户信息
          this.setData({
            isBottomModalShow: true
          })
        }
      },
      fail: err => {
        console.log(err)
      },
    })
  },
  //
  onloginSuccess(e){
    //带着用户信息跳转到用户编辑页面
    let userInfo = e.detail.userInfo
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${userInfo.nickName}&avataUrl=${userInfo.avatarUrl}`,
    })
  },
  onloginFail(){
    wx.showModal({
      title: '提示',
      content: '授权过后才能发布博客',
      showCancel:false,
      confirmColor:"#1296db"
    })
  },
  onLoad: function(options) {
    this.loadBlogList();
    db.collection('blog').count().then(res=>{
      total = res.total
    })
  },
  //获取博客列表
  loadBlogList(start=0,count=10){
    wx.showLoading({
      title: '加载中...',
    })
    return new Promise((reslove,reject)=>{
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          keyword,
          start: start,
          count: count,
          $url: "list"
        }
      }).then(res => {
        wx.hideLoading();
        this.setData({
          blogList: this.data.blogList.concat(res.result)
        })
        reslove()
      }).catch(err=>{
        console.log(err)
      })
    })
  },
  goComment(event){
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${event.currentTarget.dataset._id}`,
    })
  },
  onSearch(event){
     keyword = event.detail.keyword
     this.setData({
       blogList:[],
       isLoading:false
     })
     this.loadBlogList().then(()=>{
       if(this.data.blogList.length == 0){
         this.setData({
           isList:false
         })
       }else{
         this.setData({
           isList: true,
         })
       }
     })
     
  },
  onPullDownRefresh: function() {
    this.setData({
      blogList:[]
    })
    this.loadBlogList()
  },
  onReachBottom: function() {
    if (this.data.blogList.length == total) {
      this.setData({
        isLoading : true
      })
    }else{
      this.loadBlogList(this.data.blogList.length)
    }
  },
  onShareAppMessage:function(event){
    let blog = event.target.dataset.blog
    let blogId = event.target.dataset.blogid
    return{
      title:blog.context,
      path:`/pages/blog-comment/blog-comment?blogId=${blogId}`
    }
  }
})