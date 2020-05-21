let userInfo = {}
const db = wx.cloud.database()
Component({
  properties: {
    blogId: {
      type: String
    },
    blog: {
      type: Object
    }
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, //控制登录组件是否显示
    modalShow: false, //控制底部弹出层是否显示
    content: '', //用户输入的评价信息
  },
  methods: {
    onComment() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                userInfo = res.userInfo
                //显示评论弹框
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            //显示login弹出层
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    onloginSuccess(event) {
      userInfo = event.detail.userInfo
      //先后顺序通过回调函数实现
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    onloginFail() {
      wx.showModal({
        title: '提示',
        content: '授权过后才能评论',
        showCancel: false,
        confirmColor: "#1296db"
      })
    },
    onsend(event) {
      //将评论插入数据库
      let content = event.detail.value.content; //textarea需添加name属性获取值的方式
      let formId = event.detail.formId; //具有唯一性，消息推送时使用
      if (content.trim() == '') {
        wx.showModal({
          title: '提示',
          content: '输入内容不能为空',
          showCancel: false,
          confirmColor: "#1296db"
        })
        return
      }
      wx.showLoading({
        title: '上传评论ing',
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
        //模板消息推送
        //订阅授权
        // wx.requestSubscribeMessage({
        //   tmplIds: ['I1dfJHIO5HYgVS_EokyH9OP5kgvgn5IJHttUFh5sUA4'],//配置模板订阅信息
        //   success: res => {//授权成功处理
        //     console.log(res)
        //     wx.cloud.callFunction({
        //       name: "sendmessage",
        //       data: {
        //         content,
        //         blogId: this.properties.blogId,
        //         nickName: userInfo.nickName,
        //         formId
        //       }
        //     }).then(res => {
        //       console.log(res)
        //     })
        //   }
        // })

        wx.hideLoading();
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        this.setData({
          modalShow: false,
          content: ''
        })
        //父元素评论刷新页面
        this.triggerEvent('refreshCommentList', {
          blogId: this.properties.blogId
        })
      })
    }
  }
})