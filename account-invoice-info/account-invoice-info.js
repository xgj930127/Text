var app = getApp();
var Util = require('../../utils/util.js');
var showToast = require('../../utils/showToast.js'); //引入消息提醒暴露的接口  
var token = wx.getStorageSync("token");
var requset = function(that, token, obj, callback) {
  wx.request({ //获取消费明细
    url: 'https://sprog.makepolo.net/cpc/api/bill.php',
    data: {
      token: token,
      type: "apply_bill",
      bill_type: obj.bill_type,
      pickup_person: obj.pickup_person,
      pickup_phone: obj.pickup_phone,
      pickup_address: obj.pickup_address
    },
    method: 'GET',
    success: function(res) {
      console.log(res);
      console.log(res.data);
      if (res.data.no == 0) {
        callback();
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
    list1: [{
      title: "发票抬头",
      value: "",
      highlight: false,
      disabled: true
    },{
      title: "发票金额",
      value: "1000元",
      highlight: false,
      disabled: true
    },{
      title: "发票类型",
      placeholder: "增值税普通发票",
      value: "增值税普通发票",
      highlight: false,
      disabled: true
    }],
    list2: [{
      title: "收件人",
      placeholder: "姓名",
      value: "",
      highlight: false,
      disabled: false,
      id: "pickup_person"
    },{
      title: "联系电话",
      placeholder: "手机号码",
      value: "",
      highlight: false,
      disabled: false,
      id: "pickup_phone"
    },{
      title: "收件地址",
      placeholder: "详细地址",
      value: "",
      highlight: false,
      disabled: false,
      id: "pickup_address"
    },{
      title: "邮寄方式",
      placeholder: "顺丰速递（免费）",
      value: "顺丰速递（免费）",
      highlight: false,
      disabled: true
    }]
  },
  commitInvoice: function(e) {
    console.log(this);
    console.log(e);
    //手机号码规则
    var mobileReg = /^0?1[3|4|5|8]\d{9}$/;
    let pickup_person = this.data.list2[0].value.trim();
    let pickup_phone = this.data.list2[1].value.trim();
    let pickup_address = this.data.list2[2].value.trim();
    console.log(`pickup_person: ${pickup_person}`);
    console.log(`pickup_phone: ${pickup_phone}`);
    console.log(`pickup_address: ${pickup_address}`);
    // 判断是否合法
    if (pickup_person === "") {
      showToast.showToast({
        "title": "收件人不能为空",
        mask: false
      });
      return;
    }
    if (pickup_phone === "") {
      showToast.showToast({
        "title": "联系电话不能为空",
        mask: false
      });
      return;
    }
    if (!mobileReg.test(pickup_phone)) {
      showToast.showToast({
        "title": "请输入正确的联系电话",
        mask: false
      });
      return;
    }
    if (pickup_address === "") {
      showToast.showToast({
        "title": "收件地址不能为空",
        mask: false
      });
      return;
    }
    if (pickup_address.length > 64) {
      showToast.showToast({
        "title": "收件地址不能超过64字符",
        mask: false
      });
      return;
    }
   let obj = {};
    // 普通发票
    obj.bill_type = 0;
    obj.pickup_person = this.data.list2[0].value;
    obj.pickup_phone = this.data.list2[1].value;
    obj.pickup_address = this.data.list2[2].value;
    requset(this, token, obj, ()=>{
      wx.redirectTo({
        url: '/pages/account-apply-success/account-apply-success'
      });
    });
  },
  bindChangeUser: function(e) {
    // input更新到data
    console.log(e);
    this.setData({
      "list2[0].value": e.detail.value
    });
    console.log(`改变后的data-list2为:`);
    console.log(this.data.list2);
  },
  bindChangePhone: function(e) {
    // input更新到data
    console.log(e);
    this.setData({
      "list2[1].value": e.detail.value
    });
    console.log(`改变后的data-list2为:`);
    console.log(this.data.list2);
  },
  bindChangeAddress: function(e) {
    // input更新到data
    console.log(e);
    this.setData({
      "list2[2].value": e.detail.value
    });
    console.log(`改变后的data-list2为:`);
    console.log(this.data.list2);
  },
  onShow: function() {
    token = wx.getStorageSync("token");
    let that = this;
    // 获取发票抬头和金额
      wx.request({ //获取消费明细
        url: 'https://sprog.makepolo.net/cpc/api/bill.php',
        data: {
          token: token,
          type: "message"
        },
        method: 'GET',
        success: function(res) {
          console.log(res);
          console.log(res.data);
          if (res.data.no == 0) {
            that.setData({
              "list1[0].value": res.data.data.corpname,
              "list1[1].value": `${res.data.data.can_bill}元`
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
  })