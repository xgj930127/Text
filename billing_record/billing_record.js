//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    recordList:[{
      title:'收件人',
      content:'胡玉奇'
    },{
      title:'联系电话',
      content:'15874965487'
    },{
      title:'邮寄方式',
      content:'顺丰速递'
    },{
      title:'物流单号',
      content:'01602285'
    },{
      title:'发票类型',
      content:'增值税专用发票'
    }],
    contentList:[{
      name:'发票已寄出'
    },{
      name:'审核通过'
    },{
      name:'待审核'
    }],
    a:'￥1000',
    userInfo: {}
  },
 
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
