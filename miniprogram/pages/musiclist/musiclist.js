Page({
  data: {
    musiclist:[],
    listInfo:{}
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '小云正在努力加载QAQ',
    })
    wx.cloud.callFunction({
      name:"music",
      data:{
        playlistId:options.id,
        $url:"musiclist"
      }
    }).then(res=>{
      let {playlist} = res.result;
      this.setData({
        musiclist:playlist.tracks,
        listInfo:{
          coverImgUrl: playlist.coverImgUrl,
          name:playlist.name
        }
      })
      wx.hideLoading();
      this.setLocalMusiclist(playlist.tracks)
    })
  },
  setLocalMusiclist(musiclist){
    wx.setStorage({
      key: 'musiclist',
      data: musiclist,
    })
  }
})