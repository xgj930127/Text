var app = getApp()
var Time = require('../../utils/util.js')
var token = wx.getStorageSync("token")
var requset = function(that, token, month) {
  wx.request({ //获取消费明细
    url: 'https://sprog.makepolo.net/cpc/api/consume_list.php',
    data: {
      token: token,
      month: month
    },
    method: 'GET',
    success: function(res) {
      if (res.data.no == 0) {
        that.setData({
          "recordTitle.amount": res.data.data.sum,
          consumeList: res.data.data.result
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
      amount: "20000.00",
      name: '消费',
      year: 2017,
      month: 1
    },
    consumeList: []
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