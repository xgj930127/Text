var app = getApp();
var token = wx.getStorageSync("token");
Page({
  data: {
    invoiceList: [],
    nullShow: 0
  },
  onShow: function() {
    var that = this;
    var invoiceList = [];
    var invoice = {};
    token = wx.getStorageSync("token");
    wx.request({ //获取发票列表
      url: 'https://sprog.makepolo.net/cpc/api/bill_list.php',
      data: {
        token: token,
        type: 'list'
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        if (res.data.no == 0) {
          var resultList = res.data.data.result;
          if (resultList.length == 0) {//没有记录
            that.setData({
              nullShow: 1
            })
          } else {
            that.setData({
              nullShow: 0
            })
            for (var i = 0; i < resultList.length; i++) {
              var item = resultList[i];
              if (item.state == 0 || item.state == 3) { //开票申请中 已寄出                      
                invoice = {
                  id: item.id,
                  status: item.state_p,
                  num: '￥' + item.bill_money,
                  content: [{
                    name: '收件人',
                    value: item.pickup_person
                  }, {
                    name: '联系电话',
                    value: item.pickup_phone
                  }, {
                    name: '邮寄方式',
                    value: '顺丰速递(免费)'
                  }, {
                    name: '物流单号',
                    value: item.track_number
                  }, {
                    name: '申请时间',
                    value: item.createdate
                  }]
                };
              } else if (item.state == 1 || item.state == 2 || item.state == 4) { //申请驳回
                invoice = {
                  id: item.id,
                  status: item.state_p,
                  num: '￥' + item.bill_money,
                  content: [{
                    name: '收件人',
                    value: item.pickup_person
                  }, {
                    name: '联系电话',
                    value: item.pickup_phone
                  }, {
                    name: '申请时间',
                    value: item.createdate
                  }]
                };
              }
              invoiceList.push(invoice);
            }
            that.setData({
              invoiceList: invoiceList
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
  },
  btnDetail: function(e) { //发票详情
    console.log(e.target.dataset.id);
    wx.setStorage({
      key: "billid",
      data: e.target.dataset.id,
      success: function() {
        wx.navigateTo({
          url: '../invoice-detail/invoice-detail'
        })
      }
    });

  }
})
