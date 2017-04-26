//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    remindList:[{
      time: 300,
    },{
      time:400,
    },{
      time:500,
    },{
      time:600
    }],
    a: '充值提醒',
    money_low: '您好，您的账户余额已不足，快去充值。',
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
