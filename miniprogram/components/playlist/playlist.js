// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:0
  },
  observers:{
    //监听playlist对象某个属性值
    ['playlist.playCount'](val){
      let count = this.tranNumber(val, 2)
      this.setData({
        count,
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tranNumber(num,point){
      let numStr = num.toString().split('.')[0]
      if(num.length<6){
        return numStr
      }else if(numStr.length>=6 && numStr.length<=8){
        let decimal = numStr.substring(numStr.length-4,numStr.length-4+point)
        return parseFloat(parseInt(num/10000)+"."+decimal)+"万"
      }else if(num.length>8){
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + "." + decimal) + "亿"
      }
    },
    goToMusiclist(){
      wx.showLoading({
        title: '跳转中...',
      })
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?id=${this.properties.playlist.id}`,
        complete:()=>{
          wx.hideLoading()
        }
      })
    }
  }
})