var app = getApp();

Page({
  data: {
    remindList: [], //消息列表
    isNullShow: 0 //无消息
  },

  onShow: function() {
    console.log('isNullShow:', this.data.isNullShow)
    var that = this
    var token = wx.getStorageSync("token")
    wx.request({ //获取消息列表
      url: 'https://sprog.makepolo.net/cpc/api/notice_center.php',
      data: {
        token: token
      },
      method: 'GET',
      success: function(res) {
        if (res.data.no == 0) {
          console.log(res.data.data);
          var length = res.data.data.length
          var remindList = res.data.data
          for(var i = 0;i<remindList.length;i++){
            if(!remindList[i].tittle){
              remindList[i].title = '系统消息'
            }
          }
          that.setData({
            remindList: remindList
          })
          if (!length) {
            that.setData({
              isNullShow: 1
            })
          } else {
            that.setData({
              isNullShow: 0
            })
          }  
        } else {
          console.log(res.data.msg)
        }
      },
      fail: function(err) {
        console.log(err)
      },
      complete: function() {

      }
    })
  }
})
