var lyricHeight = 0
Component({
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: {
      type: String
    }
  },
  observers: {
    lyric(lyc) {
      if(lyc){
        this.parseLyric(lyc)
      }else{
        this.setData({
          lyriclist: [{
            lrc: "歌词还没有上传~",
            time: 0
          }]
        })
      }
    }
  },
  data: {
    lyriclist:[],
    nowLyricIndex:0,//当前播放的歌词的索引值,
    scrollTop:0,//滚动条滚动的高度
  },
  //组件生命周期
  lifetimes:{
    ready(){
      //获取设备信息
      wx.getSystemInfo({
        success: function(res) {
          lyricHeight = res.screenWidth/750*64
        },
      })
    }
  },
  methods: {
    parseLyric(sLyric) {
      var line = sLyric.split('\n');
      var lyriclist = [] //歌词列表
      // console.log(line)
      line.forEach(item => {
        var regTime = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
        let time = item.match(regTime)
        if (time != null) {
          var newtime = time.join('')
          var lrc = item.split(newtime)[1] //用时间分割获取歌词
          // console.log(lrc)
          for (var i = 0; i < time.length; i++) {
            var timeReg = time[i].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
            //把时间转换成秒
            var time2Seconds = parseInt(timeReg[1] * 60) + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000;
            lyriclist.push({
              lrc,
              time: time2Seconds
            })
          }
        }
      })
      function compare(property) {
        return function (a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        }
      }
      lyriclist.sort(compare('time2Seconds'))
      this.setData({
        lyriclist
      })
    },
    update(currentTime){
      // console.log(currentTime)
      var lrclist = this.data.lyriclist
      if(lrclist.length == 0){
        return
      }else{
        for(var i = 0;i<lrclist.length;i++){
          if (currentTime <= lrclist[i].time) {
            this.setData({
              nowLyricIndex: i - 1,
              scrollTop: (i - 1) * lyricHeight
            })
            break;
          }
        }
      }
    }
  }
})