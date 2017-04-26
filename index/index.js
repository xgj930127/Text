var app = getApp()
Page({
  data: {
    balance: 0, //余额
    quota: 0, //预算
    statistics: [], //统计数据列表   
    ad: {
      title: '',
      list: []
    },
    userInfo: {}
  },
  btnRecharge: function() { //充值
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  },
  btnBudget: function() { //预算
    wx.navigateTo({
      url: '../budget/budget'
    })
  },
  btnMore: function() { //更多
    wx.switchTab({
      url: '../charts/charts'
    })
  },
  btnAd: function() { //活动充值
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  },
  onShow: function() {
    var that = this
    var token = wx.getStorageSync("token")
    if (!token) {
      wx.redirectTo({
        url: '../login/login'
      })
    } else {
      wx.request({
        url: 'https://sprog.makepolo.net/cpc/api/main.php', //首页接口
        data: {
          token: token
        },
        method: 'GET',
        success: function(res) {
          console.log('success')
          console.log('token:' + token)
          if (res.data.no == 0) {
            wx.setStorageSync("user", res.data.data)
            that.setData({
              statistics: [{
                title: '昨日消费',
                num: '￥' + res.data.data.consume
              }, {
                title: '昨日展现',
                num: res.data.data.in_show_num
              }, {
                title: '昨日点击',
                num: res.data.data.hit_num
              }, {
                title: '昨日ACP',
                num: '￥' + res.data.data.acp
              }],
              balance: res.data.data.balance,
              quota: res.data.data.quota == 1000000 ? '--' : res.data.data.quota,
              'ad.title': res.data.data.zengsong_title,
              'ad.list': res.data.data.price
            })
          }

        },
        fail: function(err) {
          console.log(err)
        },
        complete: function() {}
      })
    }
  },
  onReady: function() {

  }
})
