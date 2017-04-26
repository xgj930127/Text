var app = getApp()
var Time = require('../../utils/util.js')
var token = wx.getStorageSync("token")
var requset = function(that, token, month) {
  wx.request({ //获取充值明细
    url: 'https://sprog.makepolo.net/cpc/api/recharge_list.php',
    data: {
      token: token,
      month: month
    },
    method: 'GET',
    success: function(res) {
      console.log('success')
      if (res.data.no == 0) {
        var resultList = res.data.data.result
        for (var i = 0; i < resultList.length; i++) {
          if (resultList[i].approach == 0) { //在线支付
            resultList[i].imgSrc = '/image/sqf/zaixian.png'
            resultList[i].payWay = '在线支付'
          }else if (resultList[i].approach == 1) { //邮局付款
            resultList[i].imgSrc = '/image/sqf/youju.png'
            resultList[i].payWay = '邮局付款'
          }else if (resultList[i].approach == 2) { //银行电汇
            resultList[i].imgSrc = '/image/sqf/yinhang.png'
            resultList[i].payWay = '银行电汇'
          } else if (resultList[i].approach == 3) { //代理商入资
            resultList[i].imgSrc = '/image/sqf/daili.png'
            resultList[i].payWay = '代理商入资'
          }else if (resultList[i].approach == 4) { //站点入资
            resultList[i].imgSrc = '/image/sqf/zhandian.png'
            resultList[i].payWay = '站点入资'
          }   else if (resultList[i].approach == 5) { //crm入资
            resultList[i].imgSrc = '/image/sqf/kefu.png'
            resultList[i].payWay = '客服代充'
          } else if (resultList[i].approach == 6) { //支付宝支付
            resultList[i].imgSrc = '/image/sqf/zfb.png'
            resultList[i].payWay = '支付宝支付'
          } else if (resultList[i].approach == 7 || resultList[i].approach == 13) { //微信支付
            resultList[i].imgSrc = '/image/sqf/wechat.png'
            resultList[i].payWay = '微信支付'
          } else if (resultList[i].approach == 10) { //订单通转款
            resultList[i].imgSrc = '/image/sqf/tongzhuan.png'
            resultList[i].payWay = '订单通转款'
          } else if (resultList[i].approach == 11) { //促销
            resultList[i].imgSrc = '/image/sqf/cuxiao.png'
            resultList[i].payWay = '促销奖励'
          } else if (resultList[i].approach == 12 || resultList[i].approach == 14) { //现金红包
            resultList[i].imgSrc = '/image/sqf/xianjin.png'
            resultList[i].payWay = '现金红包'
          } 
        }
        that.setData({
          "recordTitle.amount": res.data.data.sum,
          rechargeList: resultList
        })

      } else {
        console.log('err:' + res.data.msg)
      }

    },
    fail: function(err) {
      console.log(err)
    },
    complete: function() {}
  })
}
Page({
  data: {
    recordTitle: {
      amount: 0,
      name: '充值',
      year: 2017,
      month: 2
    },
    rechargeList: []
  },
  onShow: function() {
    token = wx.getStorageSync("token")
    var that = this
    var now = Time.formatTime(new Date())
    var time = now.split("/")
    var month = time[0] + '-' + time[1]
    that.setData({
      "recordTitle.year": time[0],
      "recordTitle.month": time[1]
    });
    requset(that, token, month)
  },
  bindDateChange: function(e) {
    var that = this
    var v = e.detail.value
    var t = v.split("-")
    var year = t[0]
    var month = parseInt(t[1])
    this.setData({
      "recordTitle.year": year,
      "recordTitle.month": month
    })
    requset(that, token, v)

  }
})