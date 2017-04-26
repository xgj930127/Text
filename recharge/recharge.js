var app = getApp()
var token = wx.getStorageSync("token")
var feedbackApi = require('../../utils/showToast.js') //引入消息提醒暴露的接口  
var paySuccessCb = function(orderid,token) { //支付成功回调
  wx.request({
    url: 'https://sprog.makepolo.net/cpc/api/callback.php',
    data: {
      token: token,
      orderid: orderid
    },
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      if (res.data.no == 0) {
        console.log(res.data.msg)
      }
    }
  })
}
Page({
  data: {
    rechargeList: [{
      num: 300,
      get: 100
    }, {
      num: 500,
      get: 200
    }, {
      num: 1000,
      get: 600
    }, {
      num: 2000,
      get: 800
    }, {
      num: 3000,
      get: 1000
    }],
    openid: '',
    inputValue: '', //输入充值金额
    money: 0, //充值金额
    checked: 1, //同意协议
    selected: [],
    user: {},
    uname: ''
  },
  onShow: function() {
    var that = this
    var token = wx.getStorageSync("token")
    var uname = wx.getStorageSync("uname")
    var user = wx.getStorageSync("user")
    that.setData({
      user: user,
      uname: uname
    })
    wx.login({ //微信登获取openid
      success: function(res) {
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              appid: 'wxfbee75ccfe6664e3',//appid
              secret: '56f343b8b9ff8780210b2b4d1b59329b',//小程序的app secret
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success: function(res) {
              that.setData({
                openid: res.data.openid
              })

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  btnGetValue: function(e) { //获取充值金额
    var that = this
    var money = e.currentTarget.dataset.value
    var selectIndex = e.currentTarget.dataset.index
    var selected = [0, 0, 0, 0, 0]
    selected[selectIndex] = 1
    console.log('selected:' + selected)
    that.setData({
      money: money,
      inputValue: '', //输入金额置0
      selected: selected
    })
    console.log('that.data.selected:' + that.data.selected)
  },
  inputMoney: function(e) { //输入充值数据
    this.setData({
      inputValue: e.detail.value,
      money: 0, //选择金额置0
      selected: [0, 0, 0, 0, 0]
    })
  },
  switchChange: function(e) { //是否同意协议
    console.log('发生 change 事件，携带值为', e.detail.value)
    this.setData({
      checked: e.detail.value
    })
  },
  btnRecharge: function() { //点击充值
    var that = this
    var openid = that.data.openid
    var checked = that.data.checked
    var token = wx.getStorageSync("token")
    var money = Number(that.data.inputValue || that.data.money)
    console.log('充值')
    console.log('money:' + money)
    if (!checked) {
      feedbackApi.showToast({
        title: '请首先阅读并同意《订单直通车产品用户服务协议》',
        mask: false
      })
    } else if (!money) {
      feedbackApi.showToast({
        title: '请选择或输入金额值',
        mask: false
      })
    } else {
      wx.request({ //获取支付参数数据
        url: 'https://sprog.makepolo.net/cpc/api/payJoinfee.php',
        data: {
          token: token,
          openid: openid,
          price: money
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.no == 0) {
            console.log('获取支付参数数据成功')
            var orderid = res.data.data.orderid
            wx.requestPayment({ //发起微信支付
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'orderid': res.data.data.orderid,
              'success': function(res) { //支付成功后回调
                console.log('res.errMsg:' + res.errMsg)
                paySuccessCb(orderid,token)
              },
              'fail': function(res) {
                console.log('res.errMsg:' + res.errMsg)
              }
            })
          } else {
            console.log('获取支付数据失败')
          }
        },
        fail: function(error) {
          console.log(error)
        }
      })
    }
  },
})
