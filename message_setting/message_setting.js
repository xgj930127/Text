var app = getApp()
Page({
  data: {
    list: [{
      id: 'view',
      src: '/image/zhanghu.png',
      url: '../billing_record/billing_record',
      name: '账户提醒'
    }, {
      id: 'content',
      src: '/image/huodong.png',
      url: '',
      name: '精选活动'
    },{
      id: 'content',
      src: '/image/xitong.png',
      url: '../remind/remind',
      name: '系统通知'
    },{
      id: 'form',
      src: '/image/hudong.png',
      url: '',
      name: '互动消息',
      last:true
    }],
    loadingShow:false,
    animationData: {}
  },
  onPullDownRefresh: function(){//下拉刷新
    console.log('下拉刷新')
    this.setData({
      loadingShow: true
    })
    var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'linear'
    })
    this.animation = animation//其他方法中使用this.animation获取动画
    animation.rotate(180).step()
    this.setData({
      animationData:animation.export()
    })
    setInterval(function() {
      animation.translate(60).step()
      this.setData({
        animationData:animation.export()
      })
    }.bind(this), 1000)

    // wx.showNavigationBarLoading()导航栏内容加载
    // 发送请求内容请求完成后回调函数中清除加载样式停止下来刷新
    // wx.hideNavigationBarLoading() 
    // wx.stopPullDownRefresh()
  }, 
  onReachBottom: function() {//上拉刷新
    // Do something when page reach bottom.
    console.log('上拉刷新');
  }


})