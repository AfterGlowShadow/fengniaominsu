// pages/order/order.js
const Toast = require('../../components/dist/toast/toast');
var wxb = require('../../utils/wxb.js');
var utils=require('../../utils/util.js');
var md5=require('../../utils/md5.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 'all',//8
        title: '所有订单'
      }, 
      {
        id: 'ToBePaid',//0
        title: '待付款'
      }, 
      {
        id: 'HaveToPay',//8
        title: '已付款'
      },
      {
        id: 'refundOf',//0
        title: '退款中'
      },
      {
        id: 'completeOrder',//1
        title: '已完成'
      },
    ],
    orderList: [],
    selectedId: 8,
    curr_page: 1,
    isLogin: false,
    total: '',
    isHideLoadMore: true
  },
  // 跳转至登录界面
  toLogin: function(){
    wx.navigateTo({
      url: '../login/login?isOrder=1',
    });
  },
  //tab导航条订单状态选择切换
  handleTabChange(e){
    var that = this;
    that.setData({
      selectedId: e.detail,
      ordertype:e.detail,
      orderList: []
    });
    console.log(e);
    // that.openToast();
    that.getOrder(e.detail, 1, that.data.ordertype);
  },
  //跳转到支付页面
  navigatorToPay(e){
    var that = this;
    wx.navigateTo({
      url: 'pay/pay?order_id=' + e.currentTarget.dataset.value,
    });
  },
  //跳转到订单详情
  navigatorToOrderDetail(e){
    wx.navigateTo({
      url: 'orderdetail/orderdetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转到评价页面
  toComment: function(e){
    wx.navigateTo({
      url: 'comment/comment?id=' + e.currentTarget.dataset.id,
    });
  },
  //totast请提示加载中
  // openToast() {
  //   Toast.loading({
  //     message: '加载中',
  //     selector: '#zan-toast-test',
  //     timeout: 500
  //   });
  // },
  // 获取订单数据
  loading() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 100)
  },
  getOrder: function(val,page=1,type){
    this.loading();
    var that = this;
    var timestamp = utils.formatTime(new Date());
    var uid = wx.getStorageSync('userinfo');
    var tokenSalt = 'HHsT52TYHF7mJtKe';
    var token = wx.getStorageSync("token");
    var str = token + timestamp + tokenSalt + uid;
    token = md5(md5(utils.sha1(md5(md5(str)))));
    wxb.Post(wxb.api.order_list, { 
        from: type,
        token: token,
        Uid: wx.getStorageSync('userinfo'),
        timeStamp: timestamp, 
      }, function (data) {
        console.log(data);
        for (var index1 in data) {
          if(data[index1]['orderStatus']==1){
            data[index1]['Status'] ="代付款";
          } else if (data[index1]['orderStatus'] == 2) {
            data[index1]['Status'] = "已付款";
          } else if (data[index1]['orderStatus'] == 3) {
            data[index1]['Status'] = "押金退款申请";
          } else if (data[index1]['orderStatus'] == 4) {
            data[index1]['Status'] = "订单退款申请";
          } else if (data[index1]['orderStatus'] == 5) {
            data[index1]['Status'] = "订单作废";
          } else if (data[index1]['orderStatus'] == 6) {
            data[index1]['Status'] = "中途退款";
          } else if (data[index1]['orderStatus'] == 7) {
            data[index1]['Status'] = "已完成";
          }
          if (data[index1]['HouseName'].length>=17){
            data[index1]['HouseName'] = data[index1]['HouseName'].substr(0,17) + "...";
          }
          var endtime=data[index1]['endTime'];
          var yue = endtime.substr(4, 2);
          var ri=endtime.substr(6,2);
          data[index1]['endTime']=yue+"月"+ri+"日";
          endtime = data[index1]['startTime'];
          yue = endtime.substr(4, 2);
          ri = endtime.substr(6, 2);
          data[index1]['startTime'] = yue + "月" + ri + "日";
        }
      that.setData({
        orderList: data,
        total: data.length,
        curr_page: 1,
        isHideLoadMore: true
      });
      Toast.clear();
    }); 
  },
  // 联系房东
  contactOwner: function(e){
    var pho = e.currentTarget.dataset.pho;
    wx.makePhoneCall({
      phoneNumber: pho,
    });
  },
  // 取消订单
  cancleOrder: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请确认是否取消订单',
      cancelColor: "#FD8238",
      confirmColor: '#ccc',
      confirmText: '确认',
      cancelText: '点错了',
      success: function(res){
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
            timeStamp: timestamp, },
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
  onLoad: function(options){
    var that = this;
    that.setData({
      isLogin: wxb.checkAuthLogin(),
      orderList: [],
      ordertype: 'all'
    });
    // if (wxb.checkAuthLogin()) {
    //   that.openToast();
      
    //   that.getOrder(that.data.selectedId,1, 'all');
    // }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      isLogin: wxb.checkAuthLogin()
    });
    console.log(wx.getStorageSync("isOrder"));
    if (wx.getStorageSync("isOrder") || wx.getStorageSync("isOrder")==false){
      console.log(that.data.ordertype)
      that.getOrder(that.data.selectedId, 1,that.data.ordertype);
      wx.removeStorageSync("isOrder");
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if(that.data.total == that.data.orderList.length) return;
    that.setData({
      isHideLoadMore: false
    });
    that.getOrder(that.data.selectedId, parseInt(that.data.curr_page) + 1, that.data.ordertype);
  },
})