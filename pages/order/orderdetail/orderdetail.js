// pages/order/pages/orderdetail/orderdetail.js
var utils = require('../../../utils/util.js');
var wxb = require('../../../utils/wxb.js');
var md5=require('../../../utils/md5.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    clock: '',
    isDisabled: false,
    isShow: false    //popup弹出层
  },
  count_down: function (duringMs) {
    var that = this
    var timer = null
    let a = 2700000 - duringMs
    if (duringMs >= 2700000) {
      that.setData({
        clock: "请重新下单",
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
      if (that.date_format(a).slice(0, 2) == '0') {
        clock1 = that.date_format(a).slice(3, 6)
      }
      else {
        clock1 = that.date_format(a)
      }
      that.setData({
        clock: clock1
      })
      if (a == 0) {
        that.setData({
          clock: "请重新下单",
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
  //跳转到房费明细
  navigatorTohouseCost(){
    var that = this;
    wx.setStorageSync("houseCost", JSON.stringify({
      minsu_name: that.data.order.HouseName,
      price: that.data.order.orderPrice,
      bg_date: that.data.order.Days,
      // count: '1'
    }));
    wx.navigateTo({
      url: '../houseCost/houseCost',
    });
  },
  togglePopup() {
    this.setData({
      isShow: !this.data.isShow
    });
  },
  //打开地图
  openLocation(){
    var that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.order.h_gw),
      longitude: parseFloat(that.data.order.h_gl),
      name: that.data.order.HouseName,
      address: that.data.order.h_location
    })
  },
  // //跳转到房屋详情页面
  // tohouseinfo(){

  // },
  //跳转到续订界面
  xuding(){
    var tian = utils.formatTime(new Date());
    // if(tian.substr(-2)<12){
      wx.navigateTo({
        url: '/pages/order/xuding/xuding?order_id=' + this.data.order.orderNumber,
      });
    // }else{
    //   wx.showToast({
    //     title: '订单已经过时 请刷新后重试',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
  },
  //跳转到代付款界面
  daifukuan(){
    wx.navigateTo({
      url: '/pages/order/pay/pay?order_id=' + this.data.order.orderNumber,
    });
  },
  //退款
  tuikuan(){
    var that = this;
    wx.showModal({
      title: '',
      content: '请确认是否退款',
      confirmColor: "#FD8238",
      success: function (res) {
        if (res.confirm) {
          var timestamp = utils.formatTime(new Date());
          var uid = wx.getStorageSync('userinfo');
          var tokenSalt = 'HHsT52TYHF7mJtKe';
          var token = wx.getStorageSync("token");
          var str = token + timestamp + tokenSalt + uid;
          token = md5(md5(utils.sha1(md5(md5(str)))));
          wxb.Post(wxb.api.tuikuan, {
            orderId: that.data.order.orderNumber,
            token: token,
            Uid: wx.getStorageSync('userinfo'),
            timeStamp: timestamp,
            RefundReason:"xiaochengxu",
            refundCode:"hjd84uwlk42s5f21s52x1x4as52g5wq2"
          },
          function (data) {
            wx.setStorageSync("isOrder", false);
            wx.navigateBack({
              delta: 2
            })
          });
        }
      }
    })
  },
  //删除订单
  deleteOrder(){
    var that=this;
    wx.showModal({
      title: '',
      content: '请确认是否删除订单',
      confirmColor: "#FD8238",
      success: function (res) {
        if (res.confirm) {
          var timestamp = utils.formatTime(new Date());
          var uid = wx.getStorageSync('userinfo');
          var tokenSalt = 'HHsT52TYHF7mJtKe';
          var token = wx.getStorageSync("token");
          var str = token + timestamp + tokenSalt + uid;
          token = md5(md5(utils.sha1(md5(md5(str)))));
          wxb.Post(wxb.api.cancle, {
            orderID: that.data.order.orderNumber,
            token: token,
            Uid: wx.getStorageSync('userinfo'),
            timeStamp: timestamp,
          },
            function (data) {
              wx.setStorageSync("isOrder",false);
              wx.navigateBack({
                delta: 2
              })
            });
        }
      }
    })
  },
  //跳转到房屋详情
  navigatorTohouseDetail(){
    if (this.data.order.orderStatus==2){
      wx.navigateTo({
        url: '/pages/houseDetail/houseDetail?room_id=' + this.data.order.room_id,
      });
    }else{
      wx.showToast({
        title: '亲,支付后才能查查看哦!',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //跳转到支付页面
  navigatorToPay(){
    wx.navigateTo({
      url: '../pay/pay?order_id=' + this.data.order.orderNumber,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var timestamp = utils.formatTime(new Date());
    var uid = wx.getStorageSync('userinfo');
    var tokenSalt = 'HHsT52TYHF7mJtKe';
    var token = wx.getStorageSync("token");
    var str = token + timestamp + tokenSalt + uid;
    token = md5(md5(utils.sha1(md5(md5(str)))));
    wxb.Post(wxb.api.order_detail, {
      orderId: options.id,
      token: token,
      Uid: wx.getStorageSync('userinfo'),
      timeStamp: timestamp,
      }, function(data){
      if(data){
        data.roomdays = data.Days;
        data.orderNumber=options.id;
        if(data.orderStatus==1){
          data.daifukuan=1;
          data.orderStatusLabel='待付款';
          data.deleteStatus = 1;
          data.locationsta = 0;
          data.typestatus = 0;
        } else if (data.orderStatus == 2) {
          data.orderStatusLabel = '已付款';
          data.deleteStatus = 1;
          data.typestatus = 1;
          var tian = utils.getDay(new Date(), 3, 0, 2);
          if (tian == data.endTime){
            data.xuding = 1;
          }else{
            data.xuding = 0;
          }
          data.locationsta = 1;
          data.typestatus = 1;
          data.type = "申请退房";
        } else if(data.orderStatus == 3) {
          data.orderStatusLabel ='押金退款申请';
          data.deleteStatus = 0;
          data.typestatus = 1;
          data.type = 1;
          data.locationsta = 1;
          data.typestatus = 0;
        }else if(data.orderStatus==4){
          data.orderStatusLabel = "退款申请中";
          data.deleteStatus = 0;
          data.typestatus = 1;
          data.type = 1;
          data.locationsta = 0;
          data.typestatus = 0;
        } else if (data.orderStatus == 5){
          data.orderStatusLabel = "订单作废";
          data.deleteStatus = 1;
          data.typestatus = 0;
          data.locationsta = 0;
        } else if (data.orderStatus == 6){
          data.orderStatusLabel ='中途退款';
          data.deleteStatus = 0;
          data.typestatus = 0;
          data.locationsta = 0;
        }else{
          data.orderStatusLabel ='已完成';
          data.deleteStatus = 1;
          data.typestatus = 0;
          data.locationsta = 0;
        }
        data.tongyi = parseInt(data.orderPrice) * data.roomdays + parseInt(data.orderDeposit);
        if (data.HouseName.length >= 13) {
          data.HouseName = data.HouseName.substr(0, 13) + "...";
        }
        if (data.HouseName.length >= 23) {
          data.h_location = data.h_location.substr(0, 23) + "...";
        }
        //提取房子当前信息 获得房费和押金
        wxb.Post(wxb.api.house_detail, { houseId: data.room_id, Uid: wx.getStorageSync('userinfo') }, function (roominfo) {
          data.orderDeposit = roominfo.orderDeposit;
          data.orderPrice = roominfo.presentPrice * data.roomdays;
          data.tongyi = parseFloat(data.orderPrice) + parseFloat(data.orderDeposit);
          that.setData({
            order: data
          });
          Toast.clear();
        }, 'Get');


        // that.setData({
        //   order: data
        // });
        //支付倒计时
        var time = utils.formatTime(new Date());
        var a = that.data.orderTime;
        var b = time.split(/[^0-9]/);
        //截止日期：日期转毫秒
        var now = new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
        var duringMs = now.getTime() - a;
        that.count_down(duringMs);
      }
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