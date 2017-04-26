var app = getApp();
var Time = require('../../utils/util.js');
var showToast = require('../../utils/showToast.js');
var token = wx.getStorageSync("token");
var can_bill;
var requset = function(that, token) {
  wx.request({ //获取发票信息
    url: 'https://sprog.makepolo.net/cpc/api/bill.php',
    data: {
      token: token,
      type: "message"
    },
    method: 'GET',
    success: function(res) {
      var isImgUpload = res.data.data.old.img_url ? 1: 0;     
      wx.setStorageSync('isImgUpload', isImgUpload); //后台获取是否已经上传图片
      wx.setStorageSync('IsInvoiceCompleted', res.data.data.wanshan); //后台获取是否完善信息
      console.log(res);
      console.log(res.data);
      if (res.data.no == 0) {
        that.setData({
          list: [{
            title: "账户名",
            placeholder: res.data.data.username,
            value: "",
            highlight: false,
            disabled: true
          }, {
            title: "现金消费金额",
            placeholder: `${res.data.data.corpus_expense}元`,
            value: "",
            highlight: false,
            disabled: true
          }, {
            title: "可开发票金额",
            placeholder: `${res.data.data.can_bill}元`,
            value: `${res.data.data.can_bill}元`,
            highlight: true,
            disabled: true
          }, {
            title: "已开发票金额",
            placeholder: `${res.data.data.has_bill}元`,
            value: "",
            highlight: false,
            disabled: true
          }]
        })
        can_bill = res.data.data.can_bill;
      } else {
        console.log('err:' + res.data.msg)
      }

    },
    fail: function(err) {
      console.log(err)
    },
    complete: function() {}
  })
};

Page({
  data: {
    list: [],
    invoice: ["增值税专用发票", "增值税普通发票"],
    invoiceIndex: 0,
  },
  onLoad: function() {
    token = wx.getStorageSync("token");
    requset(this, token);
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(this);
    this.setData({
      invoiceIndex: e.detail.value
    })
  },
  gotoApply: function(e) {
    if (can_bill<1000) {
      console.log(can_bill);
      showToast.showToast({
        "title": "发票金额少于1000元，暂不能开发票",
        mask: false
      });
      return;
    } else {
      if (this.data.invoiceIndex == 0) {
        // 增值税发票信息默认未手动完善
        wx.setStorageSync("uniqueInvoiceComplete", false);
        wx.navigateTo({
          url: "../account-unique-info/account-unique-info"
        });
      } else if (this.data.invoiceIndex == 1) {
        // console.log(21);
        wx.navigateTo({
          url: "../account-invoice-info/account-invoice-info"
        });
      }
    }

  }
})