// pages/order/order.js
const Toast = require('../../components/dist/toast/toast');
var wxb = require('../../utils/wxb.js');
var utils = require('../../utils/util.js');
var md5 = require('../../utils/md5.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    selectedId: 8,
    curr_page: 1,
    isLogin: false,
    total: '',
    isHideLoadMore: true
  },
  // 跳转至登录界面
  toLogin: function () {
    wx.navigateTo({
      url: '../login/login?isOrder=1',
    });
  },
  //跳转到收藏详情
  navigatorToOrderDetail() {
    console.log(this.data.orderList[0].houseId);
    wx.navigateTo({
      url: '../houseDetail/houseDetail?room_id=' + this.data.orderList[0].houseId,
    })
  },
  //totast请提示加载中
  openToast() {
    Toast.loading({
      message: '加载中',
      selector: '#zan-toast-test',
      timeout: 500
    });
  },
  // 获取收藏数据
  getOrder: function () {
    var that = this;
    var timestamp = utils.formatTime(new Date());
    var uid = wx.getStorageSync('userinfo');
    var tokenSalt = 'HHsT52TYHF7mJtKe';
    var token = wx.getStorageSync("token");
    var str = token + timestamp + tokenSalt + uid;
    token = md5(md5(utils.sha1(md5(md5(str)))));
    console.log(wxb.api.Showcollect);
    wxb.Post(wxb.api.Showcollect, {
      token: token,
      Uid: wx.getStorageSync('userinfo'),
      timeStamp: timestamp,
    }, function (data) {
      console.log(data);
      that.setData({
        orderList: data,
        total: data.length,
        curr_page: 1,
        isHideLoadMore: true
      });
      Toast.clear();
    });
  },
  // 取消收藏
  cancleOrder: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请确认是否取消收藏',
      cancelColor: "#FD8238",
      confirmColor: '#ccc',
      confirmText: '确认',
      cancelText: '点错了',
      success: function (res) {
        if (res.confirm) {
          var timestamp = utils.formatTime(new Date());
          var uid = wx.getStorageSync('userinfo');
          var tokenSalt = 'HHsT52TYHF7mJtKe';
          var token = wx.getStorageSync("token");
          var str = token + timestamp + tokenSalt + uid;
          token = md5(md5(utils.sha1(md5(md5(str)))));
          wxb.Post(wxb.api.cancle, {
            orderID: e.target.dataset.id,
            token: token,
            Uid: wx.getStorageSync('userinfo'),
            timeStamp: timestamp,
          },
            function (data) {
              that.setData({
                orderList: "",
                total: 1,
                curr_page: 1,
                isHideLoadMore: false
              });//   重点
              that.onLoad()//重点   重新执行下onLoad去获取当前的数据
            });
        }
      }
    })

  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      isLogin: wxb.checkAuthLogin(),
      orderList: [],
      ordertype: 'all'
    });
    this.getOrder();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
})