var app = getApp();
var showToast = require('../../utils/showToast.js'); //引入消息提醒暴露的接口  
Page({
  data: {
    isUpload: 0, //图片尚未上传
    list: [{
      title: "纳税人识别码",
      value: "",
      highlight: false
    }, {
      title: "税务地址",
      value: "",
      highlight: false
    }, {
      title: "银行账号",
      value: "",
      highlight: true
    }, {
      title: "开户银行",
      value: "",
      highlight: false
    }, {
      title: "税务电话",
      value: "",
      highlight: false
    }],
    // tempFilePaths: ""
    tempFilePaths: ""
  },
  bindChangeCode: function(e) {
    console.log(e);
    this.setData({
      "list[0].value": e.detail.value
    });
  },
  bindChangeAddress: function(e) {
    console.log(e);
    this.setData({
      "list[1].value": e.detail.value
    });
  },
  bindChangeAccount: function(e) {
    console.log(e);
    this.setData({
      "list[2].value": e.detail.value
    });
  },
  bindChangeBank: function(e) {
    console.log(e);
    this.setData({
      "list[3].value": e.detail.value
    });
  },
  bindChangePhone: function(e) {
    console.log(e);
    this.setData({
      "list[4].value": e.detail.value
    });
  },
  btnUploadImg: function() { //图片上传
    console.log('图片上传');
    var that = this;
    var isUpload = that.data.isUpload;
    if (!isUpload) {
      wx.chooseImage({
        count: 1, // 默认9  
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          console.log('获取本地图片成功')
          that.setData({
            tempFilePaths: res.tempFilePaths[0]
          })
        },
        fail: function(res) {
          console.log('获取本地图片失败')
          console.log(res)
        },
        complete: function(res) {
          console.log('获取本地图片完成')
          console.log(res)
        }
      })
    }
  },
  navBack: function() {
    console.log(this.data.tempFilePaths);
    // 先检查此页面各个数据格式
    var zuo_reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/; //验证座机
    var oldImgUrl = "/image/sqf/icon-add.png";
    var obj = {};
    obj.code = this.data.list[0].value.trim();
    obj.address = this.data.list[1].value.trim();
    obj.account = this.data.list[2].value.trim();
    obj.bank = this.data.list[3].value.trim();
    obj.phone = this.data.list[4].value.trim();
    obj.imgLocalUrl = this.data.tempFilePaths;

    if (!obj.code) {
      showToast.showToast({
        "title": "纳税人识别号不能为空",
        mask: false
      });
      return;
    } else if (!obj.address) {
      showToast.showToast({
        "title": "税务地址不能为空",
        mask: false
      });
      return;
    } else if (!obj.account) {
      showToast.showToast({
        "title": "银行账号不能为空",
        mask: false
      });
      return;
    } else if (!obj.bank) {
      showToast.showToast({
        "title": "开户银行不能为空",
        mask: false
      });
      return;
    } else if (!obj.phone) {
      showToast.showToast({
        "title": "税务电话不能为空",
        mask: false
      });
      return;
    } else if (!zuo_reg.test(obj.phone)) {
      showToast.showToast({
        "title": "请输入正确的税务电话",
        mask: false
      });
      return;
    } else if (!obj.imgLocalUrl || obj.imgLocalUrl === oldImgUrl) {
      showToast.showToast({
        "title": "证明材料不能为空",
        mask: false
      });
      return;
    }
    // 先保存到storage
    this.saveToStorage(obj, function() {
      wx.navigateBack();
    })
  },
  saveToStorage: function(obj, callback) {
    // 是否完善
    wx.setStorageSync("uniqueInvoiceComplete", true);
    wx.setStorage({
      key: "uniqueInvoiceData",
      data: obj,
      success: callback,
      fail: function() {
        console.log("saveToStorage 调用fail");
      }
    })
  },
  onLoad: function() {
    var self = this;
    wx.getStorage({
        key: "isImgUpload", //图片是否已经上传
        success: function(res) {
          console.log(res.data);
          if (res.data == 1) {
            self.setData({
              isUpload: 1
            })
          } else if (res.data == 0) {
            self.setData({
              isUpload: 0
            })
          }
        }
      })
      //localStorage存到page data中
    wx.getStorage({
      key: "uniqueInvoiceData",
      success: function(res) {
        console.log(res.data);
        // 图像为空 则设置为默认 
        var tempFilePaths = res.data.imgLocalUrl ? res.data.imgLocalUrl : "/image/sqf/icon-add.png";
        self.setData({
          "list[0].value": res.data.code,
          "list[1].value": res.data.address,
          "list[2].value": res.data.account,
          "list[3].value": res.data.bank,
          "list[4].value": res.data.phone,
          tempFilePaths: tempFilePaths
        })
      }
    })
  }
})