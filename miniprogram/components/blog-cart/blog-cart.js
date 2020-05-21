import formatTime from "../../utils/formatTime.js"
Component({
  properties: {
    blog:{
      type:Object
    }
  },
  observers:{
    ['blog.createTime'](val){
      if(val){
        //使用自定义时间格式化插件
        this.setData({
          createTime: formatTime(new Date(val))
        })
      }
    }
  },
  data: {
    createTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击图片预览
    onPreviewImage(event) {
      
      let index = event.currentTarget.dataset.index;
      //在新页面中全屏预览图片
      wx.previewImage({
        urls: this.properties.blog.img, //	需要预览的图片链接列表
        current: this.properties.blog.img[index], //当前显示图片的链接
      })
    },
  }
})
