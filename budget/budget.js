var app = getApp()
var feedbackApi = require('../../utils/showToast.js') //引入消息提醒暴露的接口  
var token = wx.getStorageSync("token")
var user
var requset = function(that, token, money) {
  wx.request({ //提交修改预算
    url: 'https://sprog.makepolo.net/cpc/api/budget.php',
    data: {
      token: token,
      type: 'update',
      money: money
    },
    method: 'GET',
    success: function(res) {
      var tipsTitle = res.data.msg
      if (res.data.no == 0) {
        feedbackApi.showToast({
          title: '设置成功',
          mask: false,
          callback: function() {
            wx.switchTab({
              url: '../index/index'
            })
          }
        })
      } else {
        console.log('err:' + res.data.msg)
        feedbackApi.showToast({
          title: tipsTitle,
          mask: false
        })
      }
    },
    fail: function(err) {
      console.log(err)
      feedbackApi.showToast({
        title: '系统繁忙，请稍后重试',
        mask: false
      })
    },
    complete: function() {}
  })
}
Page({
  data: {
    isSetBudget: 0,
    focus: false,
    inputValue: 0,
    value: '', //已设置预算值
    quota: 0, //预算
    downline: 1 //超出预算
  },
  onShow: function() {
    token = wx.getStorageSync("token")
    user = wx.getStorageSync("user")
    var quoto = user.quota
    var that = this
    if (quoto == 1000000) { //未设置预算
      this.setData({
        isSetBudget: 0,
        focus: false
      })
    } else {
      this.setData({
        isSetBudget: 1,
        focus: true,
        value: user.quota
      })
      wx.request({ //获取预算
        url: 'https://sprog.makepolo.net/cpc/api/budget.php',
        data: {
          token: token,
          type: 'list'
        },
        method: 'GET',
        success: function(res) {
          if (res.data.no == 0) {
            console.log(res.data.data.quota)
            that.setData({
              downline: res.data.data.downline //是否超出预算
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
  },
  btnSetBudget: function() { //设置预算
    this.setData({
      isSetBudget: 1,
      focus: true
    })
  },
  btnNoSetBudget: function() { //不设置预算
    this.setData({
      isSetBudget: 0,
      focus: false
    })
  },
  bindKeyInput: function(e) { //获取输入框值
    this.setData({
      inputValue: e.detail.value
    })
    console.log(e.detail.value)
  },
  btnSubmit: function() { //提交修改预算
    var that = this
    var isSetBudget = this.data.isSetBudget
    var inputValue = this.data.inputValue || this.data.value
    console.log('isSetBudget:' + isSetBudget)
    if (isSetBudget) { //设置预算
      if (inputValue < 50) {
        feedbackApi.showToast({
          title: '设置预算数额不能低于50元',
          mask: false
        })
      } else if (inputValue > 999999) {
        feedbackApi.showToast({
          title: '每日预算设置过大将失去意义，建议调整或者取消设置',
          mask: false
        })
      } else {
        requset(that, token, inputValue)
      }
    } else {
      requset(that, token, 1000000)
    }
  }
})