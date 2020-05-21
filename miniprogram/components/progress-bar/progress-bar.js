var movableAreaWidth = 0;
var movableViewWidth = 0;
var backgroundAudioManager = wx.getBackgroundAudioManager();
var currentSec = -1
var duration = 0;//歌曲总时长
var isMoving = false;//默认不拖拽 解决当进度条拖拽时和timeUpdate事件冲突的问题
Component({
  properties: {

  },
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00",
    },
    movableDis: 0,
    progress: 0
  },
  methods: {
    getMobleDis() {
      // 小程序原生捕获组件信息 返回一个 SelectorQuery 对象实例
      // 非组件使用 wx.createSelectorQuery()
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      //查看查询结果
      query.exec(rect => {
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
      })
    },
    bindBGMEvent() {
      backgroundAudioManager.onCanplay((res) => {//能播放
        const duration = backgroundAudioManager.duration
        if (typeof duration == 'undefined') {
          setTimeout(() => {
            this.setTime()
          }, 1000)
        } else {
          this.setTime()
        }
      })
      backgroundAudioManager.onPlay((res) => {//播放
        isMoving = false
        this.triggerEvent("musicPlay")
      })
      // backgroundAudioManager.onStop((res) => {//停止播放
      //   console.log('onStop')
      // })
      backgroundAudioManager.onPause((res) => {//暂停
        this.triggerEvent("musicPause")
      })
      // backgroundAudioManager.onWaiting((res) => {
      //   console.log('onWaiting')
      // })
      backgroundAudioManager.onTimeUpdate((res) => {//播放时间变化
        if (!isMoving) {
          var currentTime = backgroundAudioManager.currentTime;//当前播放的时间
          var duration = backgroundAudioManager.duration;//总时长

          var currentTimeFmt = this.dateFormat(currentTime)

          //优化处理：解决一秒内多次调用setData的问题
          var sec = currentTime.toString().split('.')[0]
          if (sec != currentSec) {
            this.setData({
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100
            })
            currentSec = sec;
            //联动歌词
            this.triggerEvent('timeUpdate',{currentTime})
          }
        }
      })
      backgroundAudioManager.onEnded((res) => {//播放结束
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        wx.wx.showToast({
          title: '出错了QAQ' + res.errCode,
          icon: 'none',
        });
      })
    },
    //对时间格式的处理
    setTime() {
      duration = backgroundAudioManager.duration
      const durationFmt = this.dateFormat(duration)
      //跟新对象下的某个属性值
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    dateFormat(time) {
      var min = Math.floor(time / 60);
      var sec = Math.floor(time % 60);
      return {
        "min": min > 9 ? min : "0" + min,
        "sec": sec > 9 ? sec : "0" + sec
      }
    },
    onChange(e) {
      if (e.detail.source == 'touch') {
        this.data.progress = e.detail.x / (movableAreaWidth - movableViewWidth) * 100;
        this.data.movableDis = e.detail.x;
        let time = duration * this.data.progress / 100
        let currentTimeFmt = this.dateFormat(time)
        this.setData({
          ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
        })
        isMoving = true;
      }
    },
    onTouchEnd() {
      let time = duration * this.data.progress / 100
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
      })
      backgroundAudioManager.seek(time)
      isMoving = false;
    }
  },
  // 组件中的生命周期
  lifetimes: {
    ready() {
      this.getMobleDis()
      this.bindBGMEvent()
    }
  }
})
