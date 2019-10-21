// pages/order/xuding/xuding.js
var utils = require('../../../utils/util.js');
var md5 = require('../../../utils/md5.min.js');
var wxb = require('../../../utils/wxb.js');
var md5 = require('../../../utils/md5.min.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.order_id) {
      var timestamp = utils.formatTime(new Date());
      var uid = wx.getStorageSync('userinfo');
      var tokenSalt = 'HHsT52TYHF7mJtKe';
      var token = wx.getStorageSync("token");
      var str = token + timestamp + tokenSalt + uid;
      token = md5(md5(utils.sha1(md5(md5(str)))));
      wxb.Post(wxb.api.order_detail, {
        orderId: options.order_id,
        token: token,
        Uid: wx.getStorageSync('userinfo'),
        timeStamp: timestamp,
      }, function (data) {
        //提取房子当前信息 获得房费和押金
        wxb.Post(wxb.api.house_detail, { houseId: data.room_id, Uid: wx.getStorageSync('userinfo') }, function (roominfo) {
          data.orderDeposit = roominfo.orderDeposit;
          data.orderPrice = roominfo.presentPrice;
          data.tongyi = parseFloat(data.orderPrice) + parseFloat(data.orderDeposit);
          data.orderNumber = options.order_id;
          if (data.orderPrice) {
            that.setData({
              order: data
            });
          }
          Toast.clear();
        }, 'Get');
      });
    }
  },
  //续订订单
  pay() {
    var tian = utils.formatTime(new Date());
    // if (tian.substr(-2) < 12) {
      var that = this;
      wx.showModal({
        title: '',
        content: '请确认是否续订此订单',
        confirmColor: "#FD8238",
        success: function (res) {
          if (res.confirm) {
            var timestamp = utils.formatTime(new Date());
            var uid = wx.getStorageSync('userinfo');
            var tokenSalt = 'HHsT52TYHF7mJtKe';
            var token = wx.getStorageSync("token");
            var str = token + timestamp + tokenSalt + uid;
            token = md5(md5(utils.sha1(md5(md5(str)))));
            wxb.Post(wxb.api.xuding, {
              orderID: that.data.order.orderNumber,
              token: token,
              Uid: wx.getStorageSync('userinfo'),
              timeStamp: timestamp,
              type: "xiaochengxu",
              openid: wx.getStorageSync("appid"),
            },
              function (res) {
                if (res) {
                  console.log(res);
                  var md5str = "appId=" + res.appid + "&nonceStr=" + res.nonceStr + "&package=prepay_id=" + res.prepayId + "&signType=MD5" + "&timeStamp=" + res.timeStamp + "&key=381e753f5113es6f3783c605f41b73b5";
                  console.log(md5str);
                  md5str = md5(md5str);
                  md5str = md5str.toUpperCase();
                  console.log(md5str);
                  // return false;
                  wx.requestPayment({
                    appId: res.appid,
                    timeStamp: res.timeStamp,
                    nonceStr: res.nonceStr,
                    package: "prepay_id=" + res.prepayId,
                    signType: "MD5",
                    paySign: md5str,
                    // total_fee: Number(that.data.orderPrice) * Number(that.data.Days) + Number(that.data.orderDeposit),
                    success: function (res) {
                      wx.showToast({
                        title: '支付成功',
                      });
                      setTimeout(function () {
                        wx.setStorageSync("isOrder", true);
                        wx.switchTab({
                          url: '../order',
                        });
                      }, 500);
                    },
                    fail: function (res) {
                      console.log(res);
                      wx.showToast({
                        title: '支付失败',
                      });
                    },
                    complete: function (res) {
                      console.log(res);
                      wx.showToast({
                        title: '支付失败',
                      });
                    }
                  })
                }
              });
          }
        }
      })
    // } else {
    //   wx.showToast({
    //     title: '订单已经过时 请刷新后重试',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})