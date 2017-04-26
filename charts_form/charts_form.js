
var Charts = require('../../utils/wxcharts.js')

Page({
  data: {
    recording: false,
    playing: false,
    hasRecord: false,
    chartsList:[{
      title:'机械'
    },{
      title:'机械'
    },{
      title:'工业'
    },{
      title:'工业'
    },{
      title:'服装'
    }],
    detList:[{
      num:'1000',
      name:'展现'
    },{
      num:'100',
      name:'点击'
    },{
      num:'10%',
      name:'点击率'
    },{
      num:'￥100.00',
      name:'消费'
    },{
      num:'￥1.00',
      name:'平均点击价格'
    }]
  },
  onLoad: function() {

  },
  onReady: function() { //页面渲染完毕
    console.log('页面渲染完毕');
    new Charts({
      canvasId: 'myCanvas',
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '成交量1',
        data: [3, 6, 12, 14, 18, 22],
        format: function(val) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [4, 8, 11, 16, 19, 24],
        format: function(val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '',
        format: function(val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 320,
      height: 300
    });
  }
})