// pages/order/pages/pay/pay.js
var utils = require('../../../utils/util.js');
var md5=require('../../../utils/md5.min.js');
var wxb = require('../../../utils/wxb.js');
var md5=require('../../../utils/md5.min.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: '',
    clock: '',
    order_id: '',
    isDisabled: false
  },
  count_down: function (duringMs) {   
    var that = this;
    var timer = null;
    let a = 2700000 - duringMs;   
    if(duringMs >= 2700000){ 
      that.setData({
        clock: "支付已截止，请重新下单",
        isDisabled: true
      });
      return
    }
    that.setData({
      clock: that.date_format(a)
    })
    timer = setInterval(function () {
      let clock1 = ''
      a -= 1000;
      if(that.date_format(a).slice(0,2)=='0'){
        clock1 = that.date_format(a).slice(3, 6)
      }
      else{
        clock1 = that.date_format(a)
      }
      that.setData({
        clock: clock1
      })
      if (a == 0) {
        that.setData({
          clock: "支付已截止，请重新下单",
          isDisabled: true
        })
        // timeout则停止timer
        clearInterval(timer)
        wx.navigateBack({
          delta: -1
        })
      }
    }, 1000)
  },
  /* 格式化倒计时 */
  date_format(micro_second) {
    var that = this
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = that.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = that.fill_zero_prefix(second % 60);// equal to => var sec = second % 60;
    return min + "分" + sec + "秒";
  },
  /* 分秒位数补0 */
  fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
  },
  // 支付
  pay: function(){
    var that = this;
    var timestamp = utils.formatTime(new Date());
    var uid = wx.getStorageSync('userinfo');
    var tokenSalt = 'HHsT52TYHF7mJtKe';
    var token = wx.getStorageSync("token");
    var str = token + timestamp + tokenSalt + uid;
    token = md5(md5(utils.sha1(md5(md5(str)))));
    wxb.Post(wxb.api.pay, {
      order_id: that.data.order_id,
      orderID: that.data.order_id, 
      token: token,
      type:"xiaochengxu",
      openid: wx.getStorageSync("appid"),
      Uid: wx.getStorageSync('userinfo'),
      timeStamp: timestamp,}, function(res){
      if(res){
        console.log(res);
        var md5str = "appId=" + res.appid + "&nonceStr=" + res.nonceStr + "&package=prepay_id=" + res.prepayId + "&signType=MD5" + "&timeStamp=" + res.timeStamp +"&key=381e753f5113es6f3783c605f41b73b5";
        console.log(md5str);
        md5str= md5(md5str);
        md5str = md5str.toUpperCase();
        console.log(md5str);
        // return false;
        wx.requestPayment({
          appId: res.appid,
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: "prepay_id="+res.prepayId,
          signType: "MD5",
          paySign: md5str,
          // total_fee: Number(that.data.orderPrice) * Number(that.data.Days) + Number(that.data.orderDeposit),
          success: function (res) {
            wx.showToast({
              title: '支付成功',
            });
            setTimeout(function(){
              wx.setStorageSync("isOrder", true);
              wx.switchTab({
                url: '../order',
              });
            },500);         
          },
          fail: function(res){
            console.log(res);
            wx.showToast({
              title: '支付失败',
            });
          },
          complete: function(res){
            console.log(res);
            wx.showToast({
              title: '支付失败',
            });
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.order_id){
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
          if (data.orderPrice){
          that.setData({
            price: Number(data.orderPrice)*Number(data.Days)+Number(data.orderDeposit),
            order_id: options.order_id
          });
        }
      });
    }
  },
})