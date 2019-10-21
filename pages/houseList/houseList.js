// pages/search/search.js
var wxb = require('../../utils/wxb.js');  //API接口请求核心文件
var util = require('../../utils/util.js');
const Toast = require('../../components/dist/toast/toast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    starttime: '',     //页面显示的日期
    endtime: '',
    bg_date: '',      //传值给日历页面用的日期
    end_date: '',
    place: {
      title: '位置',
      value: '0'
    },
    sort_value: 0,
    sort: [
      {
        value: '0',
        name: '排序'
      },
      {
        value: '1',
        name: '推荐排序',
      },
      {
        value: '2',
        name: '距离排序',
      },
      {
        value: '3',
        name: '价格低到高',
      },
      {
        value: '4',
        name: '价格高到低',
      },
      {
        value: '5',
        name: '好评排序'
      }
    ],
    filter: [
      {
        title: '筛选',
        value: ''
      }
    ],
    filter_num: 0,
    levelList: [
      { id: 1, title: '豪华', url: 'icon-jingpin1' },
      { id: 2, title: '精品', url: 'icon-jingpin'},
      { id: 3, title: '舒适', url: 'icon-zuowu-xiaomai'},
    ],
    houseList: [],
    isHideLoadMore: true,
    isHideNoMore: false,
    keyword:"",
    total: 0,
    curr_page:0,
    current_page: 1,
    isWeek: ''
  },
  // 跳转到排序选择页面
  toSort: function(){
    var that = this;
    wx.navigateTo({
      url: 'sort/sort?value=' + that.data.sort_value,
    });
  },
  //查找
  searchChange: function (e) {
    var text = e.detail.value;
    this.setData({
      keyword: text,
    })
  },
  // 跳转到位置选择页面
  toPlace: function () {
    var that = this;
    wx.navigateTo({
      url: 'place/place?value=' + that.data.place.value + '&mainActiveIndex=' + that.data.place.mainActiveIndex,
    });
  },
  // 跳转到筛选页面
  toFilter: function () {
    var that = this;
    wx.navigateTo({
      url: 'filter/filter?value=' + that.data.sort_value,
    });
  },
  //跳转到房屋详情
  navigatorToHouseDetail(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../houseDetail/houseDetail?room_id=' + id
    })
  },
  // 提示加载中
  loading() {
    Toast.loading({
      message: '加载中',
      selector: '#zan-toast-test',
      timeout: 1000
    });
  },
  search:function(){
    var list=[];
    list['weizhi'] = JSON.parse(wx.getStorageSync('index_dataList'));
    list["current_page"] = 1;
    list['keyword'] = this.data.keyword;
    this.getHouse(list);
  },
  // 查询房屋列表数据
  getHouse: function(params){
    var that=this;
    that.loading();
    var weizhi = params['weizhi'];
    wx.setNavigationBarTitle({
      title: weizhi[1] + " " + weizhi[2]
    })
    var weizi = [];
    weizi['pro_name'] = weizhi[0];
    weizi['city_name'] = weizhi[1];
    weizi['area_name'] = weizhi[2];
    wxb.Post(wxb.api.getLocation, weizi, function (data) {
      var tuijian = [];
      tuijian['city_id'] = data;
      tuijian['psize'] = 8;
      tuijian['keyword'] = params['keyword'];
      tuijian['page'] =params['current_page'];
      tuijian['longitude'] = wx.getStorageSync("longitude");
      tuijian['latitude'] = wx.getStorageSync("latitude");
      var time = JSON.parse(wx.getStorageSync("wxb_bg_end_date"));
      var stime="";
      var etime="";
      stime = util.formatTime(new Date(time['bg_date']));
      etime=util.formatTime(new Date(time['end_date']));
      tuijian['time']=stime.substring(0, stime.length - 2);
      tuijian['etime'] = etime.substring(0, etime.length - 2);
      tuijian['area'] = data;
      
      console.log(tuijian);
      wxb.Post(wxb.api.Searh_house, tuijian, function (data) {
        // console.log(data);
        var items = {};
        var recommend = [];
        var total=0;
        for (var index in data) {
          recommend[index]={};
          recommend[index].Id = data[index].houseId;
          recommend[index].ClassArray = data[index].ClassArray;
          recommend[index].DescribeText = data[index].DescribeText;
          recommend[index].MainText = data[index].MainText;
          recommend[index].HouseName = data[index].HouseName;
          recommend[index].ImageUrl = data[index].ImageUrl;
          recommend[index].Price = data[index].Price;
          recommend[index].peopleNum = data[index].peopleNum;
          recommend[index].roomNum = data[index].roomNum;
          recommend[index].Distance = data[index].Distance;
          total=data[index].count;
        }
        console.log(recommend);
        that.setData({
          isHide: true,
          total: total,
          houseList: recommend
        });
      }, 'Get')
    });
  },
  
  // 获取查询条件
  getQueryCon: function(){
    var that = this;
    var list;
    that.loading();
    if (wx.getStorageSync("filter_num")) {
      that.setData({
        filter_num: wx.getStorageSync("filter_num")
      });
    } else {
      that.setData({
        filter_num: 0
      });
    }
    if (wx.getStorageSync('index_dataList')) {
      list = JSON.parse(wx.getStorageSync('index_dataList'));
    } else {
      list = {
        bg_date: util.getDateStr(false, 0),
        end_date: util.getDateStr(false, 1),
        appropriate: 0,
        city_id: 257,
        lat: 22.93772,
        lng: 113.38424,
        order: 1
      }
    }
    // 获取日期选择关键字
    if (wx.getStorageSync("wxb_bg_end_date")) {
      var dateList1 = wx.getStorageSync("wxb_bg_end_date");
      var dateList2 = JSON.parse(dateList1);
      var bg_date;
      var end_date;
      var bg_date1 = dateList2.bg_date1.substring(0, 2);
      var bg_date2 = dateList2.bg_date1.substring(3, 5);
      var end_date1 = dateList2.end_date1.substring(0, 2);
      var end_date2 = dateList2.end_date1.substring(3, 5);
      that.setData({             //给日历传值变量赋值
        bg_date: bg_date1 + '月' + bg_date2 + '日',
        end_date: end_date1 + '月' + end_date2 + '日'
      });
      if (bg_date1.substring(0, 1) == '0') {
        bg_date1 = bg_date1.substring(1, 2);
        if (bg_date2.substring(0, 1) == '0') {
          bg_date2 = bg_date2.substring(1, 2);
          bg_date = bg_date1 + '.' + bg_date2;
        }
        else {
          bg_date = bg_date1 + '.' + bg_date2;
        }
      }
      else {
        bg_date1 = bg_date1.substring(0, 2);
        if (bg_date2.substring(0, 1) == '0') {
          bg_date2 = bg_date2.substring(1, 2);
          bg_date = bg_date1 + '.' + bg_date2;
        }
        else {
          bg_date = bg_date1 + '.' + bg_date2;
        }
      }
      if (end_date1.substring(0, 1) == '0') {
        end_date1 = end_date1.substring(1, 2);
        if (end_date2.substring(0, 1) == '0') {
          end_date2 = end_date2.substring(1, 2);
          end_date = end_date1 + '.' + end_date2;
        }
        else {
          end_date = end_date1 + '.' + end_date2;
        }
      }
      else {
        end_date1 = end_date1.substring(0, 2);
        if (end_date2.substring(0, 1) == '0') {
          end_date2 = end_date2.substring(1, 2);
          end_date = end_date1 + '.' + end_date2;
        }
        else {
          end_date = end_date1 + '.' + end_date2;
        }
      }
      if (dateList2) {
        that.setData({
          starttime: bg_date,
          endtime: end_date
        });
        list['bg_date'] = dateList2.bg_date;
        list['end_date'] = dateList2.end_date;
      }
    } else {
      var bg_end_data = {
        day: 2,
        day2: 1,
        bg_date: util.getDateStr(false, 0),
        end_date: util.getDateStr(false, 1),
        bg_date1: util.getDateStr(false, 0).slice(5, 7) + '月' + util.getDateStr(false, 0).slice(8) + '日',
        end_date1: util.getDateStr(false, 1).slice(5, 7) + '月' + util.getDateStr(false, 1).slice(8) + '日'
      };
      wx.setStorageSync("wxb_bg_end_date", JSON.stringify(bg_end_data));
    }
    // 获取排序关键字
    if (wx.getStorageSync("search_sort_value")) {
      var value = wx.getStorageSync("search_sort_value");
      that.setData({
        sort_value: value
      });
      list['order'] = parseInt(value);
      wx.removeStorageSync('search_sort_value');
    }
    //获取位置经纬度
    if (that.data.place.value.lat) {
      list['lat'] = that.data.place.value.lat;
      list["lng"] = that.data.place.value.lng;
    }
    //请求后端房屋列表数据
    that.setData({
      houseList: []
    });
    // that.getHouse(list);
    //设置页面的标题
    if (wxb.getCity().city_name) {
      wx.setNavigationBarTitle({
        title: wxb.getCity().city_name,
      });
    }
    wx.setStorageSync('index_dataList', JSON.stringify(list));
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var list=[];
    list['weizhi'] = JSON.parse(wx.getStorageSync('index_dataList'));
    list["current_page"] = that.data.curr_page + 1;
    list['keyword'] = that.data.keyword;
    // console.log(list);
    this.getHouse(list);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(wx.getStorageSync("isQuery")){
      that.getQueryCon();
      wx.removeStorageSync("isQuery");
    }  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('activeList');
    wx.removeStorageSync('filter_num');
    wx.removeStorageSync('place_activeId');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log(that.data.total)
    if(that.data.total == that.data.houseList.length) return;
    that.setData({
      isHideLoadMore: false
    });
    if (wx.getStorageSync('index_dataList')) {
      var list=[];
      list['weizhi'] = JSON.parse(wx.getStorageSync('index_dataList'));
      list["current_page"] = that.data.curr_page+1;
      list['keyword'] = that.data.keyword;
    }
    that.getHouse(list);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync("app_info").app_name,
      path: '/pages/houseList/houseList?userid=' + JSON.parse(wx.getStorageSync("userinfo")).user_id
    }
  },
})