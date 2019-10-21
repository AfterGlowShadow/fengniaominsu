// pages/profile/suggestion/suggestion.js
const Toast = require('../../../components/dist/toast/toast');
var wxb = require('../../../utils/wxb.js');
var utils=require("../../../utils/util.js");
var md5=require("../../../utils/md5.min.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaValue: '',
    tel: '000-000-0000',
    isDisabled: false
  },
  //唤起手机
  openPhone: function(){
    var tel = this.data.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    });
  },
  //获取输入框内容
  getTextarea: function(e){
    this.setData({
      textareaValue: e.detail.value
    });
  },
  //提交内容
  submit: function(){
    var that = this;
    if(that.data.textareaValue == ''){
      Toast({
        message: '请输入内容',
        selector: '#zan-toast-test'
      });
    }
    else{
      that.setData({
        isDisabled: true
      });
      var that = this;
      var timestamp = utils.formatTime(new Date());
      var uid = wx.getStorageSync('userinfo');
      var tokenSalt = 'HHsT52TYHF7mJtKe';
      var token = wx.getStorageSync("token");
      var str = token + timestamp + tokenSalt + uid;
      token = md5(md5(utils.sha1(md5(md5(str)))));
      wxb.Post(wxb.api.Advice, {
        adviceText: that.data.textareaValue,
        token: token,
        Uid: wx.getStorageSync('userinfo'),
        timeStamp: timestamp,
      }, function (data) {
        setTimeout(function(){
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 900
          });
          that.setData({
            isDisabled: false
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: -1
            });
          }, 800);
        },800);
      }); 
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
})