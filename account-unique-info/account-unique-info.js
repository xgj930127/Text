var app = getApp();
var Util = require('../../utils/util.js');
var showToast = require('../../utils/showToast.js'); //引入消息提醒暴露的接口  
var token = wx.getStorageSync("token");
var IsInvoiceCompleted;
var requset = function(that, token, obj, callback) {
  wx.request({ //获取消费明细
    url: 'https://sprog.makepolo.net/cpc/api/bill.php',
    data: {
      token: token,
      type: 'apply_bill',
      bill_type: obj.bill_type,
      pickup_person: obj.pickup_person,
      pickup_phone: obj.pickup_phone,
      pickup_address: obj.pickup_address,
      numbers: obj.numbers,
      tel_add: obj.tel_add,
      mobile: obj.mobile,
      bank_acc: obj.bank_acc,
      account: obj.account,
      name: obj.name
        // name: "testName"
    },
    method: 'GET',
    success: function(res) {
      console.log(res);
      console.log(res.data);
      if (res.data.no == 0) {
        callback();
      } else {
        // 给的接口进入此处流程
        console.log('err:' + res.data.msg)
      }

    },
    fail: function(err) {
      console.log(err)
    },
    complete: function() {}
  })
};
// 提交数据（上传图片及input数据）
var upload = function(that, obj, imgUrl, callback) {
  var url = "https://sprog.makepolo.net/cpc/api/bill.php?token=" + token + "&type=apply_bill";
  console.log('imgUrl', imgUrl);
  var isFromWeb = imgUrl.substr(0, 7).toLowerCase() == "http://" ? 1 : 0;
  console.log('isFromWeb', !!isFromWeb)
  if (isFromWeb) { //网络图片
    console.log('网络资源')
    obj.imgurl = imgUrl
    console.log(obj, 1)
    wx.request({
      url: url,
      data: obj,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log('success')
        console.log('res.data.no:' + res.data.no)
        if (res.data.no == 0) {
          callback();
        }
      },
      fail: function(error) {
        feedbackApi.showToast({
          title: '系统繁忙，请稍后重试',
          mask: false
        })
        console.log('httpsfail')
        console.log(error)
      },
      complete: function() {}
    })
  } else { //本地资源
    console.log('本地资源')
    wx.uploadFile({
      url: url,
      filePath: imgUrl,
      // name: 'file',
      // 必须写成这样 代表是文件
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: obj,
      success: function(res) {
        console.log(res);
        console.log(res.data);
        console.log(res.data.msg);
        callback();
        // var data = res.data
      },
      fail: function(res) {
        showToast.showToast({
          title: res.errMsg,
          mask: false
        });
        console.log(res);
      }
    })
  }
};
Page({
  data: {
    list1: [{
      title: "发票抬头",
      placeholder: "",
      value: '',
      highlight: false
    }, {
      title: "发票金额",
      placeholder: "",
      value: "",
      highlight: false
    }, {
      title: "发票类型",
      placeholder: "增值税专用发票",
      value: "增值税专用发票",
      highlight: false
    }],
    list2: [{
      title: "收件人",
      placeholder: "姓名",
      value: "",
      highlight: false
    }, {
      title: "联系电话",
      placeholder: "手机号码",
      value: "",
      highlight: false
    }, {
      title: "收件地址",
      placeholder: "详细地址",
      value: "",
      highlight: false
    }, {
      title: "邮寄方式",
      placeholder: "顺丰速递（免费）",
      value: "顺丰速递（免费）",
      highlight: false
    }],
    list3: [{
      title: "增值税专用发票信息",
      placeholder: "未完善",
      value: "",
      highlight: false
    }],
    completeStatus: "未完善"
  },
  commitInvoice: function(e) {
      // 是否完善
      if (wx.getStorageSync("uniqueInvoiceComplete") == false && wx.getStorageSync("IsInvoiceCompleted") == 1) { //之前与手动均未完善
        showToast.showToast({
          title: "请先完善发票信息！",
          mask: false
        });
        return;
      }
      // 本页信息是否填写完成
      // 规则
      var mobileReg = /^0?1[3|4|5|8][0-9]\d{8}$/;
      var pickup_person = this.data.list2[0].value.trim();
      var pickup_phone = this.data.list2[1].value.trim();
      var pickup_address = this.data.list2[2].value.trim();
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
      if (!pickup_phone) {
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
      if (!pickup_address) {
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

      // 获取第二页内容 和这页内容  （包含第2页的图片）传到后端
      var obj2 = wx.getStorageSync("uniqueInvoiceData");
      // 此处必须写上 name: file
      let obj = {
        token: token,
        name: "file",
        type: "apply_bill",
        bill_type: 1,
        pickup_person: encodeURI(this.data.list2[0].value),
        pickup_phone: this.data.list2[1].value,
        pickup_address: encodeURI(this.data.list2[2].value),
        numbers: obj2.code,
        tel_add: encodeURI(obj2.address),
        mobile: obj2.phone,
        bank_acc: encodeURI(obj2.bank),
        account: obj2.account,
        imgurl: ''
      };
      var imgUrl = obj2.imgLocalUrl;
      console.log('imgUrl', imgUrl)
        // requset(this, token, obj, ()=>{
        //   wx.redirectTo({
        //     url: '/pages/account-apply-success/account-apply-success'
        //   });
        // });
      upload(this, obj, imgUrl, () => {
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
    IsInvoiceCompleted = wx.getStorageSync("IsInvoiceCompleted");
    console.log('IsInvoiceCompleted:' + IsInvoiceCompleted); //2是已完善 1未完善
    var that = this;
    var t = wx.getStorageSync("uniqueInvoiceComplete"); //手动完善
    that.setData({
      completeStatus: IsInvoiceCompleted == 2 ? "已完善" : "未完善"
    });
    if (IsInvoiceCompleted == 1 && t == true) { //手动完善
      that.setData({
        completeStatus: "已完善"
      });
    }
    // 未完善已完善字样 设置值 并渲染到页面
    // var t = wx.getStorageSync("uniqueInvoiceComplete");
    // var completeStatus = t === "true" ? "已完善" : "未完善";
    // this.setData({
    //   completeStatus: completeStatus
    // });
    // 获取发票抬头和金额
    wx.request({
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
          });
          // 设置storage,保存专用信息
          var obj = {
            code: res.data.data.old.numbers || '',
            address: res.data.data.old.tel_add || '',
            account: res.data.data.old.account || '',
            bank: res.data.data.old.bank_acc || '',
            phone: res.data.data.old.mobile || '',
            imgLocalUrl: res.data.data.old.img_url || '/image/sqf/icon-add.png'
          };
          // 若已经手动设置过storage则跳过设置这个步骤
          console.log('uniqueInvoiceComplete:', !!wx.getStorageSync("uniqueInvoiceComplete"))
          if (wx.getStorageSync("uniqueInvoiceComplete")) {
            return;
          }
          wx.setStorage({
            key: "uniqueInvoiceData",
            data: obj,
            success: function() {
              console.log("saveToStorage 调用success");
            },
            fail: function() {
              console.log("saveToStorage 调用fail");
            }
          });
        } else {
          console.log('err:' + res.data.msg)
        }
      },
      fail: function(err) {
        console.log(err)
      },
      complete: function() {}
    });
  }
})