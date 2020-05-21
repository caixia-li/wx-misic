// components/bottom-modal/bottom-modal.js
Component({
  properties: {
    modalShow:{
      type:Boolean,
      value:false
    }
  },
  data: {

  },
  methods: {
    //关闭弹出层
    onClose(){
      this.setData({
        modalShow:false
      })
    }
  },
  //组件样式隔离
  options: {
    styleIsolation: 'apply-shared',//页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  }
})
