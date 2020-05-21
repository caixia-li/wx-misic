// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise'); // 发送http请求
const URL = "http://musicapi.xiecheng.live/personalized/"

cloud.init()

const db = cloud.database();
const playlistCollection = db.collection('playlist')
const MAX_LIMIT = 100;


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 请求获取到 推荐歌单数据
  const playlist = await rp(URL).then(res => {
    return JSON.parse(res).result
  })

  // 获取数据库中数据
  // var list = await playlistCollection.get();  // 一次性最多可以获取100条  

  var newData = []  // 去重后的数据

  var countRusult = await playlistCollection.count();
  var total = countRusult.total;  // 获取数据总条数据
  var batchTimes = Math.ceil(total / MAX_LIMIT)
  var tasks = []  // 接受所有的任务
  for (var l = 0; l < batchTimes; l++) {
    // skip().limit() 从第几个索引值开始  查新几条数据
    let promise = playlistCollection.skip(l * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise)
  }

  var list = {
    data: []
  }

  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 为了避免数据重复添加所以做去重处理
  for (var j = 0; j < playlist.length; j++) {
    var flag = true;
    for (var k = 0; k < list.data.length; k++) {
      if (playlist[j].id == list.data[k].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[j])
    }
  }

  // 将不重复的数据添加到【数据库]中
  for (var i = 0; i < newData.length; i++) {
    db.collection('playlist').add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log('插入数据')
    }).catch((err) => {
      console.log('插入数据失败')
    })
  }

  return {
    openid: wxContext.OPENID,
  }
}
