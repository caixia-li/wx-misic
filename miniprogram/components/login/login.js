// components/login/login.js
Component({
  properties: {
    modalShow: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    onGetUserInfo(e){
      const userInfo = e.detail.userInfo
      if(userInfo){
        this.setData({
          modalShow:false
        })
        //告诉blog登录成功
        this.triggerEvent('loginsuccess',{userInfo})
      }else{
        this.triggerEvent('loginfail')
      }
    }
  }
})
