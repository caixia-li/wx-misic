const MAX_LIMIT = 9;
const db = wx.cloud.database();
Page({
  data: {
    swiperImgs: [],
    musicList: []
  },
  /**生命周期函数--监听页面加载*/
  onLoad: function(options) {
    this.getPlayList();
    this.getSwiperList();
  },
  getPlayList() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        start: this.data.musicList.length,
        count: MAX_LIMIT,
        $url:"playlist"
      }
    }).then(res => {
      this.setData({
        musicList: this.data.musicList.concat(res.result.data)
      })
      wx.hideLoading();
    })
  },
  getSwiperList(){
    db.collection('swiper').get().then(res=>{
      this.setData({
        swiperImgs:res.data
      })
    })
  },
  /**页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function() {
    this.setData({
      musicList: []
    });
    this.getPlayList()
  },
  /** 页面上拉触底事件的处理函数*/
  onReachBottom: function() {
    this.getPlayList()
  },
  /** 生命周期函数--监听页面初次渲染完成*/
  onReady: function() {

  },

  /**生命周期函数--监听页面显示*/
  onShow: function() {

  },

  /**生命周期函数--监听页面隐藏*/
  onHide: function() {

  },

  /** 生命周期函数--监听页面卸载*/
  onUnload: function() {

  },
  /**用户点击右上角分享*/
  onShareAppMessage: function() {

  }
})