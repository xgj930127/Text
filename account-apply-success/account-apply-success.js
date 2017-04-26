var app = getApp();
Page({
  data: {
    list: [{
      title: "账户名",
      placeholder: "huyuqi",
      value: "",
      highlight: false
    },{
      title: "现金消费金额",
      placeholder: "1000元",
      value: "",
      highlight: false
    },{
      title: "可开发票金额",
      placeholder: "0元",
      value: "1000元",
      highlight: true
    },{
      title: "已开发票金额",
      placeholder: "0元",
      value: "",
      highlight: false
    }]
  },
  gotoInvoice: function() {
    wx.redirectTo({
       url: '../invoice/invoice'
    })
  }
})