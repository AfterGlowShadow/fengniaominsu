// pages/search/search.js
var wxb = require('../../../utils/wxb.js');  //API接口请求核心文件
var util = require('../../../utils/util.js');
const Toast = require('../../../components/dist/toast/toast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList: []
  },
  //跳转到房屋详情
  navigatorToHouseDetail(e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    if (e.currentTarget.dataset.status == 1 || e.currentTarget.dataset.status == 2){
      wx.showToast({
        title: '已经被预订',
        duration: 1000,
        mask: true
      })
    }else{
      wx.navigateTo({
        url: '../../houseDetail/houseDetail?room_id=' + id
      })
    }
  },
  // //跳转到支付
  // navigatorToPay(e){
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../../houseDetail/houseDetail?room_id=' + id
  //   })
  // },
  // 提示加载中
  loading() {
    Toast.loading({
      message: '加载中',
      selector: '#zan-toast-test',
      timeout: -100
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // var that = this;
    // var list = [];
    // list['weizhi'] = JSON.parse(wx.getStorageSync('index_dataList'));
    // list["current_page"] = that.data.curr_page + 1;
    // list['keyword'] = that.data.keyword;
    wx.setNavigationBarTitle({
      title: options.fenlei_name
    })
    this.getHouse(options.fenlei_type);
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
    // var that = this;
    // console.log(that.data.total)
    // if (that.data.total == that.data.houseList.length) return;
    // that.setData({
    //   isHideLoadMore: false
    // });
    // if (wx.getStorageSync('index_dataList')) {
    //   var list = [];
    //   list['weizhi'] = JSON.parse(wx.getStorageSync('index_dataList'));
    //   list["current_page"] = that.data.curr_page + 1;
    //   list['keyword'] = that.data.keyword;
    // }
    // that.getHouse(list);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // return {
    //   title: wx.getStorageSync("app_info").app_name,
    //   path: '/pages/houseList/houseList?userid=' + JSON.parse(wx.getStorageSync("userinfo")).user_id
    // }
  },
  loading() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 100)
  },
  //根据类型获得房源
  getHouse(typeid) {
    this.loading();
    var that = this;
    var tuijian = [];
    tuijian['from'] = 'house';
    tuijian['HousingTypes'] = typeid;
    tuijian['longitude'] = wx.getStorageSync("longitude");
    tuijian['latitude'] = wx.getStorageSync("latitude");
    tuijian['area_id'] = wx.getStorageSync("area_id");
    wxb.Post(wxb.api.ShowFeiLei, tuijian, function (data) {
      var houseList = [];
      var wei = 0;
      if(data.db2.length!==0){
        for (var index1 in data.db2) {
          houseList[index1] = {};
          houseList[index1].Id = data.db2[index1].houseId;
          if (data.db2[index1].Location.length>13){
            houseList[index1].HouseName = data.db2[index1].Location.substr(0, 13)+"...";
          }else{
            houseList[index1].HouseName = data.db2[index1].Location;
          }
          houseList[index1].imageURL = data.db2[index1].ImageUrl;

          houseList[index1].ClassArray = data.db2[index1].ClassArray;
          houseList[index1].presentPrice = data.db2[index1].presentPrice;
          houseList[index1].Distance = data.db2[index1].distances;
          houseList[index1].MainText = data.db2[index1].MainText;
          houseList[index1].peopleNum = data.db2[index1].peopleNum;
          houseList[index1].roomNum = data.db2[index1].roomNum;
          houseList[index1].status = 0;
          if (typeid == 'PreferentialHousing'){
            houseList[index1].originalPrice = data.db2[index1].originalPrice;
          }
          wei = index1;
        }
      }
      if(wei!=0){
        wei++;
      }
      index1=0;
      if(data.db1.length!==0){
        for (var index1 in data.db1) {
          houseList[Number(index1) + Number(wei)] = {};
          houseList[Number(index1) + Number(wei)].Id = data.db1[index1].houseId;
          if (data.db1[index1].Location.length > 14) {
            houseList[Number(index1) + Number(wei)].HouseName = data.db1[index1].Location.substr(0, 14)+"...";
          } else {
            houseList[Number(index1) + Number(wei)].HouseName = data.db1[index1].Location;
          }
          houseList[Number(index1) + Number(wei)].imageURL = data.db1[index1].ImageUrl;
          houseList[Number(index1) + Number(wei)].ClassArray = data.db1[index1].ClassArray;
          houseList[Number(index1) + Number(wei)].presentPrice = data.db1[index1].presentPrice;
          houseList[Number(index1) + Number(wei)].Distance = data.db1[index1].distances;
          houseList[Number(index1) + Number(wei)].MainText = data.db1[index1].MainText;
          houseList[Number(index1) + Number(wei)].peopleNum = data.db1[index1].peopleNum;
          houseList[Number(index1) + Number(wei)].roomNum = data.db1[index1].roomNum;
          if (typeid == 'PreferentialHousing') {
            houseList[Number(index1) + Number(wei)].originalPrice = data.db1[index1].originalPrice;
          }
          if (data.db1[index1].db==2){
            houseList[Number(index1) + Number(wei)].status = 2;
          }else{
            houseList[Number(index1) + Number(wei)].status = 1;
          }
          console.log(Number(index1) + Number(wei));
        }
      }
      console.log(houseList);
      that.setData({
        isHide: true,
        // recommendList: recommend,
        houseList: houseList
        // Thlist: Thlist
      });
    }, 'Get')
  }
})