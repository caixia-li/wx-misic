const MAX_WORDS_NUM = 140;
const MAX_IMG_NUM = 9;
let context = ''; //输入框中的内容
let userInfo = null;
const db = wx.cloud.database()
Page({
  data: {
    wordsNum: '', //用户输入的字数
    footerBottom: 0, //顶部定位位置
    images: [], //用户选中的图片
    selectPhoto: true, //选择图片是否显示
  },
  onInput(event) {
    context = event.detail.value
    let wordsNum = event.detail.value.length;
    if (wordsNum == MAX_WORDS_NUM) {
      wordsNum = `最多输入${MAX_WORDS_NUM}个字符`
    }
    this.setData({
      wordsNum
    })
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  //选择并添加图片
  onChooseImage() {
    wx.chooseImage({
      count: MAX_IMG_NUM - this.data.images.length, //最多可以选择的图片张数
      sizeType: ['original', 'compressed'], //所选的图片的尺寸
      sourceType: ['album', 'camera'], //	选择图片的来源
      success: res => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        this.onSelectPhoto();
      }
    })
  },
  //删除图片
  onDelImage(event) {
    let index = event.currentTarget.dataset.index;
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })
    this.onSelectPhoto();
  },
  //切换是否显示添加图片按钮
  onSelectPhoto() {
    let num = MAX_IMG_NUM - this.data.images.length;
    this.setData({
      selectPhoto: num > 0 ? true : false
    })
  },
  //点击图片预览
  onPreviewImage(event) {
    let index = event.currentTarget.dataset.index;
    //在新页面中全屏预览图片
    wx.previewImage({
      urls: this.data.images, //	需要预览的图片链接列表
      current: this.data.images[index], //当前显示图片的链接
    })
  },
  onLoad: function(options) {
    userInfo = options
  },
  //上传
  onSend() {
    //图片上传云存储，云存储返回云文件id
    //云数据库：文字内容，返回的云文件id,博客的创建时间，用户个人信息
    if (context.trim() == "") {
      wx.showModal({
        title: '提示',
        content: '发布内容不能为空~',
        showCancel: false,
        confirmColor: '#1296db',
      })
    } else {
      wx.showLoading({
        title: '正在努力上传中~',
        mask: true //遮罩层
      })
      let promiseArr = [];
      let filesId = [];
      //1.图片上传云存储,当名字冲突时会冲突  是多个异步 等多个异步执行完毕(Promise.all)
      this.data.images.forEach((item, index) => {
        //文件扩展名正则
        let suffix = /\.\w+$/.exec(item)[0]
        let p = new Promise((reslove, reject) => {
          wx.cloud.uploadFile({
            cloudPath: `blog/${Date.now()}-${parseInt(Math.random() * 1000000)}${suffix}`,
            filePath: item,
            success: res => {
              filesId.push(res.fileID)
              reslove(res.fileID)
            },
            error: () => {
              reject()
            }
          })
        })
        promiseArr.push(p)
      })
      Promise.all(promiseArr).then(res => {
        db.collection('blog').add({
          data: {
            ...userInfo,
            context,
            img: filesId,
            createTime: db.serverDate() //上传服务器的时间
          }
        })
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          icon: 'success',
        })
        let pages = getCurrentPages();//获取博客的页面
        pages[0].setData({
          blogList: []
        })
        pages[0].loadBlogList()
        wx.navigateBack()
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
    }
  },
})