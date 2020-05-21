// miniprogram/pages/mine/mine.js
Page({
  onGetOrCode(){
    wx.showLoading({
      title: '生成中...',
      mask:true
    })
    wx.cloud.callFunction({
      name:"setOrCode"
    }).then(res=>{
      wx.hideLoading();
      let fileId = res.result;
      wx.previewImage({
        current:fileId,
        urls:[fileId]
      })
    })
  },
  data: {

  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})