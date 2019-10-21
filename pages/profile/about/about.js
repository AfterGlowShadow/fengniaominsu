// pages/profile/about/about.js
var wxb=require("../../../utils/wxb.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wxb.Post(wxb.api.About, {
    }, function (data) {
      var temp=0;
      var info ="";
      for(var i=0;i<=data.length;i++){
        if (data[i] != " " && data[i] != undefined){
            if(temp==1){
              info +="&emsp;&emsp;"+data[i];
              temp=0;
            }else{
              info += data[i];
            }
        }else{
          temp=1;
        }
      }
      that.setData({
        info: info
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