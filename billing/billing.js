//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    billingList:[{
      title:'发票抬头',
      content:'马克波罗'
    },{
      title:'发票金额',
      content:'1000'
    },{
      title:'收件人',
      content:'胡玉奇'
    },{
      title:'收件地址',
      content:'北京市海淀区'
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
    },{
      title:'申请时间',
      content:'2017-01-06'
    },{
      title:'纳税人识别码',
      content:'123456778'
    },{
      title:'银行账号',
      content:'624559606903025'
    },{
      title:'开户银行',
      content:'中国工商银行海淀支行'
    },{
      title:'税务电话',
      content:'010-4858585'
    }],
    b:'',
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
