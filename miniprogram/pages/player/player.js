const app = getApp()
let musiclist = [];//歌曲列表
let newPlayingIndex = -1;//当前播放的歌曲索引值
//获取全局背景音乐播放管理
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  data: {
    picUrl:'',//歌曲图片
    isPlaying:false,//控制播放暂停
    isLyricShow:false,//歌词显示隐藏
    lyric:''
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    newPlayingIndex = options.musicId;
    this.getLocalMusiclist();
    this.getMusicDetail();
  },
  onPullDownRefresh: function () { 

  },
  //获取本地的歌曲列表
  getLocalMusiclist(){
    musiclist = wx.getStorageSync("musiclist");
    wx.hideLoading();
  },
  //获取当前播放歌曲的详情信息
  getMusicDetail(){
    var musicDetail = musiclist[newPlayingIndex]
    wx.setNavigationBarTitle({
      title: musicDetail.name,
      isPlaying:false
    })
    this.setData({
      picUrl:musicDetail.al.picUrl
    })
    var musicId = musicDetail.al.id;//音乐id
    app.setPlayingMusicId(musicId)
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url: "musicUrl",
        musicId
      }
    }).then(res=>{
      var result = JSON.parse(res.result)
      if(result.data[0].url){
        backgroundAudioManager.src = result.data[0].url;//音频地址
        backgroundAudioManager.title = musicDetail.name;//音频标题
        backgroundAudioManager.signer = musicDetail.ar[0].name;//歌手
        backgroundAudioManager.coverImgUrl = musicDetail.al.picUrl;//背景图片
        backgroundAudioManager.epname = musicDetail.al.name;//专辑名
        this.setData({
          isPlaying:true
        })
        //保存播放历史
        this.savePlayHistory()
      }else{
        // 没有音乐地址
        backgroundAudioManager.stop()
        wx.showToast({
          title: '该音乐还在路上~',
          duration:500
        })
        this.setData({
          lyric: ''
        })
      }
    }).catch(console.error)
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'lyric',
        musicId,
      }
    }).then(res => {
      var lrc = JSON.parse(res.result).lrc
      if (lrc) {
        this.setData({
          lyric: lrc.lyric
        })
      } else {
        this.setData({
          lyric: ''
        })
      }
    }).catch(console.error)
  },
  //播放暂停
  togglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev(){
    backgroundAudioManager.stop()
    newPlayingIndex--
    if(newPlayingIndex<0){
      newPlayingIndex = musiclist.length - 1
    }
    this.getMusicDetail()
    this.setData({
      isLyricShow: false
    })
    
  },
  onNext(){
    backgroundAudioManager.stop()
    newPlayingIndex++
    if(newPlayingIndex>musiclist.length - 1){
      newPlayingIndex = 0
    }
    this.getMusicDetail()
    this.setData({
      isLyricShow:false
    })
  },
  //歌词切换
  onChangeLyricShow(){
    this.setData({
      isLyricShow:!this.data.isLyricShow
    })
  },
  //接收歌曲播放的时间进程
  timeUpdate(event){
    //选中自定义组件
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  //同步背景的暂停和播放
  musicPause(){
    this.setData({
      isPlaying: false
    })
  },
  musicPlay(){
    this.setData({
      isPlaying:true
    })
  },
  //保存播放音乐到本地--历史记录
  savePlayHistory(){
    var musicDetail = musiclist[newPlayingIndex]
    var musicId = musicDetail.al.id;//音乐id
    let openid = app.globalData.openid;
    let history = wx.getStorageSync(openid);
    let len = history.length
    let flag = false;//音乐是否存在
    for(var i=0;i<len;i++){
      if (history[i].al.id==musicId){
        flag = true;
        break
      }
    }
    if (!flag) {
      history.unshift(musicDetail)
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
  }
})