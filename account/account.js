var app = getApp()
Page({
  data: {
    accountRemain: "",
    money: [],
    nav: [{
      imgUrl: "/image/sqf/icon001.png",
      text: "充值记录",
      link: "/pages/account-recharge-detail/account-recharge-detail"
    }, {
      imgUrl: "/image/sqf/icon002.png",
      text: "消费记录",
      link: "/pages/account-consume-detail/account-consume-detail"
    }, {
      imgUrl: "/image/sqf/icon003.png",
      text: "开票记录",
      link: "/pages/invoice/invoice"
    }]
  },
  callPhone: function() { //客服
    wx.makePhoneCall({
      phoneNumber: '010-62559142'
    })
  },
  applyInvoice: function() {
    wx.navigateTo({
      url: "/pages/account-apply-invoice/account-apply-invoice"
    });
  },
  recharge: function() {
    wx.navigateTo({
      url: "/pages/recharge/recharge"
    });
  },
  clearStorage:function(e){//清除缓存
    if(e.detail.value){
      wx.clearStorage()
      wx.switchTab({
            url:'../index/index'
      });
    }
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
        url: 'https://sprog.makepolo.net/cpc/api/main.php',
        data: {
          token: token
        },
        method: 'GET',
        success: function(res) {
          if (res.data.no == 0) {
            that.setData({
              accountRemain: res.data.data.balance,
              money: [{
                num: res.data.data.corpus_balance,
                text: "现金余额"
              }, {
                num: res.data.data.rebate_balance,
                text: "优惠余额"
              }, {
                num: res.data.data.expense,
                text: "消费总额"
              }]
            });
          }

        },
        fail: function(err) {
          console.log(err)
        },
        complete: function() {}
      })
    }

  },
  logout: function() {
    var token = wx.getStorageSync("token");
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          // 退出登录接口
          wx.request({
            url: "https://sprog.makepolo.net/cpc/api/logout.php?token=" + token,
            success: function(res) {
              console.log(res);
              if (res.data.no === 0) {
                wx.clearStorage();
                wx.redirectTo({
                  url: "../login/login"
                });
              }
            }
          })
        }
      }
    });
  }
});