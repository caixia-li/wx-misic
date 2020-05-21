let keyword = '';//
Component({
  //导入外部样式
  // externalClasses: ['iconfont','icon-sousuo'],
  properties: {
    placeholder: {
      type: String,
      value: '请输入内容'
    }
  },
  data: {

  },
  methods: {
    onInput(event) {
      keyword = event.detail.value
    },
    onSearch() {
      this.triggerEvent('search',{keyword})
     },
  }
})
