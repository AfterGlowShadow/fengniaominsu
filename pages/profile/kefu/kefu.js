// pages/profile/about/about.js
var wxb = require("../../../utils/wxb.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qq:"",
    phone:""
  },
  //拨打电话
  Callphone:function(){
    var tel = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: tel,
    });
  },
  //跳转到qq
  Callqq:function(){
      var that = this;
      wx.setClipboardData({
        //准备复制的数据
        data: that.data.qq,
        success: function (res) {
          wx.showToast({
            title: '复制成功',
          });
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wxb.Post(wxb.api.Contact, {
    }, function (data) {
      that.setData({
        phone: data.Phone,
        qq:data.QQ
      })
    }); 
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