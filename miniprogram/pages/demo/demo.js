// miniprogram/pages/demo/demo.js
Page({
music(){
  wx.cloud.callFunction({
    name:"tcbRouter",
    data:{
      $url:'music'
    }
  }).then(res=>{
    console.log(res)
  })
},
movie(){
  wx.cloud.callFunction({
    name: "tcbRouter",
    data: {
      $url: 'movie'
    }
  }).then(res => {
    console.log(res)
  })
}
})