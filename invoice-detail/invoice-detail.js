var app = getApp();
var token = wx.getStorageSync("token");
var requset = function(that, token, id) {
  wx.request({ //获取发票详情
    url: 'https://sprog.makepolo.net/cpc/api/bill_list.php',
    data: {
      token: token,
      type: "one",
      id: id
    },
    method: 'GET',
    success: function(res) {
      console.log(res.data);
      if (res.data.no == 0) {
        if (res.data.data.type == '增值税普通发票') { //普通发票
          that.setData({
            list: [{
              title: '发票抬头',
              cont: res.data.data.corpname,
            }, {
              title: '发票金额',
              cont: res.data.data.bill_money,
            }, {
              title: '收件人',
              cont: res.data.data.pickup_person,
            }, {
              title: '收件地址',
              cont: res.data.data.pickup_address,
            }, {
              title: '联系电话',
              cont: res.data.data.pickup_phone,
            }, {
              title: '邮寄方式',
              cont: '顺丰快递(免费)',
            }, {
              title: '物流单号',
              cont: res.data.data.track_number,
            }, {
              title: '发票类型',
              cont: res.data.data.type,
            }]
          })
        } else if (res.data.data.type == '增值税专有发票') { //专有发票
          that.setData({
            list: [{
              title: '发票抬头',
              cont: res.data.data.corpname,
            }, {
              title: '发票金额',
              cont: res.data.data.bill_money,
            }, {
              title: '收件人',
              cont: res.data.data.pickup_person,
            }, {
              title: '收件地址',
              cont: res.data.data.pickup_address,
            }, {
              title: '联系电话',
              cont: res.data.data.pickup_phone,
            }, {
              title: '邮寄方式',
              cont: '顺丰快递(免费)',
            }, {
              title: '物流单号',
              cont: res.data.data.track_number,
            }, {
              title: '发票类型',
              cont: res.data.data.type,
            }, {
              title: '纳税人识别码',
              cont: res.data.data.numbers,
            }, {
              title: '银行账号',
              cont: res.data.data.account,
            }, {
              title: '开户银行',
              cont: res.data.data.bank_acc,
            }, {
              title: '税务电话',
              cont: res.data.data.mobile,
            }]

          })
        }
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
    list: [],

  },

  onShow: function() {
    var that = this;
    token = wx.getStorageSync("token");
    wx.getStorage({
      key: 'billid',
      success: function(res) {
        console.log(res.data);
        var nId = res.data;
        requset(that, token, nId);
      }
    });


  }
})
