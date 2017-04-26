var app = getApp()
Page({
  data: {
    list1: [{
      id: 'view',
      src: '/image/wechatHL.png',
      date: '11月10日 12:30',
      name: '充值记录'
    }, {
      id: 'content',
      src: '/image/wechatHL.png',
      date: '11月10日 12:30',
      name: '消费记录'
    }, {
      id: 'form',
      src: '/image/wechatHL.png',
      name: '开票记录',
      date: '11月10日 12:30',
      last:true
    }],
    list2: [{
      id: 'kefu',
      src: '/image/wechat.png',
      date: '11月10日 12:30',
      name: '客服电话'
    }, {
      id: 'online',
      src: '/image/wechat.png',
      date: '11月10日 12:30',
      name: '在线客服'
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