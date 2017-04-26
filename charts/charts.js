// var Charts = require('../../utils/wxcharts.js')
var app = getApp()
var token = wx.getStorageSync("token")
var day_limit //查询天数 
var cat //查询分类 
var type = '' //选择类型date catagory
var isNoLimit //不限天数
var requestData = function(that, token, date, category) { //获取数据type:纵坐标显示类型
  wx.request({ //设置图标按钮数量数据
    url: 'https://sprog.makepolo.net/cpc/api/more_effect_cat.php',
    data: {
      token: token,
      day_limit: date || '',
      cat: category || 0
    },
    method: 'GET',
    success: function(res) {
      if (res.data.no == 0) {
        var chartSrc = ''
        var type = that.data.type
        console.log('type:' + type)
        if (res.data.data.length == 0) { //数据为空
          var nullImg = 'http://api.makepolo.net/cpc/api/get_chart.php?data=[]';
          that.setData({
            consume: 0, //消费金额
            inShowNum: 0, //展示数量
            hitNum: 0, //点击数量
            scp: 0, //点击率
            chartSrc: nullImg,
            picInShowNum: nullImg,
            picConsume: nullImg,
            picHitNum: nullImg,
            picScp: nullImg
          })
        } else {
          if (type == 'inShowNum') { //展示
            chartSrc = res.data.data.pic_show
          } else if (type == 'consume') { //消费
            chartSrc = res.data.data.pic_consume
          } else if (type == 'hitNum') { //点击量
            chartSrc = res.data.data.pic
          } else if (type == 'scp') { //点击率
            chartSrc = res.data.data.pic_scp
          }

          that.setData({
            consume: res.data.data.consume, //消费金额
            inShowNum: res.data.data.in_show_num, //展示数量
            hitNum: res.data.data.hit_num, //点击数量
            scp: res.data.data.scp, //点击率
            chartSrc: chartSrc,
            picInShowNum: res.data.data.pic_show,
            picConsume: res.data.data.pic_consume,
            picHitNum: res.data.data.pic,
            picScp: res.data.data.pic_scp
          })
        }
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
    consume: 0, //消费金额
    inShowNum: 0, //展示数量
    hitNum: 0, //点击数量
    scp: 0, //点击率
    // recording: false,
    // playing: false,
    // hasRecord: false,
    selected: { //数据项目列表
      inShowNum: 1, //默认选中展示数量
      consume: 0, //消费金额
      hitNum: 0, //点击数量
      scp: 0 //点击率
    },
    type: 'inShowNum',
    list: [],
    picInShowNum: '',
    picConsume: '',
    picHitNum: '',
    picScp: '',
    chartSrc: '' //表单路径
  },
  onShow: function() {
    var that = this
    isNoLimit = 0
    token = wx.getStorageSync("token")
    wx.request({ //获取分类数据
      url: 'https://sprog.makepolo.net/cpc/api/cat.php',
      data: {
        token: token
      },
      method: 'GET',
      success: function(res) {
        if (res.data.no == 0) {
          var categories = res.data.data
          var categorieArray = [{//初始化设置所有分类
            id: 0,
            value: '所有分类',
            selected: true
          }]
          for (var key in categories) {
            categorieArray.push({
              id: key,
              value: categories[key],
              selected: false
            })
          }
          console.log(categorieArray)
          that.setData({
            list: [{
              id: 'date',
              name: '最近30天',
              open: false,
              nav: [{
                id: 7,
                value: '7天',
                selected: false
              }, {
                id: 30,
                value: '30天',
                selected: true
              }, {
                id: '',
                value: '不限天数',
                selected: false
              }]
            }, {
              id: 'category',
              name: '所有分类',
              open: false,
              nav: categorieArray
            }]

          })
        }
      },
      fail: function(err) {
        console.log(err)
      },
      complete: function() {}
    })
    requestData(that, token, 30) //获取图表数据

  },
  btnChooseItem: function(e) { //获取分类id
    var that = this
    var id = e.currentTarget.dataset.id
    var list = that.data.list
    console.log('id:' + id)
    console.log('type:' + type)
    if (type == 'date') { //选取天数
      day_limit = id
      if (!day_limit) { //不限天数
        isNoLimit = 1
        that.setData({
          'list[0].name': '不限天数',
          'list[0].nav[0].selected': false,
          'list[0].nav[1].selected': false,
          'list[0].nav[2].selected': true
        })
      } else {
        that.setData({
          'list[0].name': '最近' + id + '天'
        })
        for (var i = 0; i < list[0].nav.length; i++) { //选中内容背景标记
          console.log('list[0].nav[i].id: ' + list[0].nav[i].id)
          if (list[0].nav[i].id == id) {
            list[0].nav[i].selected = true;
          } else {
            list[0].nav[i].selected = false;
          }

        }
      }
      if (!cat) {
        cat = 0
      }
    } else if (type == 'category') { //选择分类
      cat = id
      if (!day_limit && !isNoLimit) {
        day_limit = 30
      }
      for (var i = 0; i < list[1].nav.length; i++) { //选中内容背景标记
        console.log('list[1].nav[i].id: ' + list[1].nav[i].id)
        if (list[1].nav[i].id == id) {
          list[1].nav[i].selected = true;
          that.setData({
            'list[1].name': list[1].nav[i].value
          })
        } else {
          list[1].nav[i].selected = false;
        }

      }

    }
    console.log('day_limit:' + day_limit)
    console.log('cat:' + cat)
    for (var i = 0, len = list.length; i < len; ++i) {
      list[i].open = false;
    }
    that.setData({
      list: list
    });
    requestData(that, token, day_limit, cat)
  },
  widgetsToggle: function(e) {
    var id = e.currentTarget.id,
      list = this.data.list;
    console.log('id:' + id)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      list: list
    });
    if (id == 'date') {
      type = 'date'
    } else if (id == 'category') {
      type = 'category'
    }
  },
  btnGetItem: function(e) { //获取需要展示的数据项目
    var that = this
    var item = e.currentTarget.dataset.item
    var selected = {
      inShowNum: 0, //默认选中展示数量
      consume: 0, //消费金额
      hitNum: 0, //点击数量
      scp: 0 //点击率      
    }
    selected[item] = 1 //转换成选中状态
    that.setData({
      selected: selected,
      type: item
    });
    var chartSrc = ''
    if (item == 'inShowNum') { //展示
      chartSrc = that.data.picInShowNum
    } else if (item == 'consume') { //消费
      chartSrc = that.data.picConsume
    } else if (item == 'hitNum') { //点击量
      chartSrc = that.data.picHitNum
    } else if (item == 'scp') { //点击率
      chartSrc = that.data.picScp
    }
    console.log('chartSrc:' + chartSrc)
    that.setData({
      chartSrc: chartSrc
    })

  }
})