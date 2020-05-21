const app = new getApp()
Component({
  properties: {
    musiclist:{
      type:Array
    }
  },
  data: {
    musiclistId:-1
  },
  pageLifetimes:{
    show(){
      this.setData({
        musiclistId: app.getPlayingMusicId()
      })
    }
  },
  methods: {
    onSelect(e){
      this.setData({
        musiclistId: e.currentTarget.dataset.musiclistid
      })
      wx.showLoading({
        title: '跳转中...',
      })
      wx.navigateTo({
        url: `/pages/player/player?musicId=${e.currentTarget.dataset.index}`,
        complete:()=>{
          wx.hideLoading()
        }
      })
    }
  }
})
