// pages/profile/profile.js
var wxb = require('../../utils/wxb.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    transtoollist: [
      {
        id: 'mensuo',//8
        title:"智能门锁",
        imageURL:'../../img/profile/suo.jpg'
      },
      {
        id: 'fangyuan',//0
        title: "发布房源",
        imageURL: '../../img/profile/fabu.jpg'
      },
      {
        id: 'kefu',//1
        title: "联系客服",
        imageURL: '../../img/profile/kefu.jpg'
      },
      {
        id: 'dingdan',//1
        title: "我的订单",
        imageURL: '../../img/profile/dingdan.jpg'
      }
    ]
  },
  //横向操作栏
  TransTool: function (e) {
    console.log(e);
    console.log(e.currentTarget.dataset.id);
    var type = e.currentTarget.dataset.id;
    if(type=='mensuo'){
      wx.showModal({
        title: '',
        content: '很抱歉，目前小程序暂不支持门锁功能',
        confirmColor: "#FD8238",
      });
    }else if(type=='fangyuan'){
      wx.navigateTo({
        url: 'fangyuan/fabu/fabu',
      });
    }else if(type=='kefu'){
      wx.navigateTo({
        url: 'kefu/kefu',
      });
    }else if(type=="dingdan"){
      var that = this;
      if (!that.data.isLogin) that.toLogin();
      else
        wx.switchTab({
          url: '../order/order',
        });
    }
  },
  //我的房源
  ShowMeFangyuan:function(){
    wx.navigateTo({
      url: 'fangyuan/chakan/chakan',
    });
  },
  //进入登录界面
  toLogin: function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //跳转到设置手机页面
  toSetPhone: function(){
    wx.navigateTo({
      url: 'setPhone/setPhone',
    });
  },
  //个人设置
  Userset:function(){
    wx.navigateTo({
      url: 'userset/userset',
    });
  },
  //点击发票
  invoiceOpen: function(){
    wx.showModal({
      title: '',
      content: '很抱歉，目前小程序暂不支持开发票',
      confirmColor: "#FD8238",
    });
  },
  //个人收藏
  ShowMeShoucang:function(){
    wx.navigateTo({
      url: '../collection/collection',
    });
  },
  //联系客服
  // contact: function(){
  //   var p = '000-000-0000';
  //   var tel = wx.getStorageSync("app_info").service_tel;
  //   if (wx.getStorageSync("app_info")) {
  //     p = tel.slice(0, 3) + '-' + tel.slice(3, 6) + '-' + tel.slice(6);
  //   }
  //   wx.showModal({
  //     title: '提示',
  //     content: '拨打蜂鸟客服：'+p,
  //     confirmColor: "#FD8238",
  //     success(res) {
  //       if(res.confirm){
  //         wx.makePhoneCall({
  //           phoneNumber: p,
  //         });
  //       }
  //     }
  //   });
  // },
  //跳转至优惠券页面
  toCoupon: function(){
    var that = this;
    if(!that.data.isLogin) that.toLogin();
    else{
      wx.navigateTo({
        url: 'coupon/coupon',
      });
    }
  },
  //领取优惠券
  tosetinfomation: function () {
    wx.navigateTo({
      url: '../setinfomation/setinfomation',
    })
  },
  //意见反馈
  toSuggestion: function(){
    wx.navigateTo({
      url: 'suggestion/suggestion',
    })
  },
  //关于我们
  ToAbout:function(){
    wx.navigateTo({
      url: 'about/about',
    })
  },
  //跳转到信息管理界面
  toSetPhone: function () {
    wx.navigateTo({
      url: '../setinformation/setinformation',
    });
  },
  //退出登录
  exit: function(){
    var that = this;
    wx.showModal({
      title: '',
      content: '请确认是否退出登录',
      confirmColor: "#FD8238",
      success(res) {
        if(res.confirm){
          that.setData({
            isLogin: false
          });
          wx.removeStorageSync("userinfo");
          wx.removeStorageSync("userauth");
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var isLogin = false;
    if(wxb.checkAuthLogin()){
      this.setData({
        isLogin: true
      });
    }
  },

})