const Toast = require('../../components/dist/toast/toast');
var wxb = require('../../utils/wxb.js');
var md5 = require('../../utils/md5.min.js');
var utils = require('../../utils/util.js')
var app = getApp();

Page({
  data: {
    isLogin: true,
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61,
    userPhone: '',   //手机号码
    valatedCode: '',  //图形验证码
    codeNum: '',  //数字验证码
    tabId: 0,
    bindphone:'',//身份证号
    pwd:'',
    repwd:'',
    disabled: false,
    imgUrl: '',
    sjn: 1100,
    isFinished: false
  },
  onLoad: function (options) {
    var that = this;
    wx.getExtConfig({
      success: function (res) {
        res.extConfig;
        that.setData({
          imgUrl: res.extConfig.apiurl + wxb.api.captcha + '?appid=' + res.extConfig.appid + '&appkey=' + res.extConfig.appkey
        });
      }
    });
  },
  //刷新图形验证码
  getImg: function () {
    this.setData({
      sjn: Math.random(100, 100000)
    });
  },
  //tab切换
  changeTab: function () {
    var that = this;
    var id = 0;
    if (that.data.tabId == 0) id = 1;
    that.setData({
      tabId: id
    });
  },
  //验证码倒计时
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    // if (that.data.valatedCode == '') {
    //   Toast({
    //     message: '请先输入图形验证码',
    //     selector: '#zan-toast-test'
    //   });
    // }
    // else {
      wxb.Post(wxb.api.getSMS, {
        account: that.data.userPhone,
        checkCode: "g4sd24f2d4s2s25fd2w1gf25g1d2z52s",
        from:"register"
      }, function (data) {
        console.log(data);
        that.setData({
          disabled: true
        });
        var interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: '已发送(' + currentTime + 's)'
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              time: '重新发送',
              currentTime: 61,
              disabled: false
            })
          }
        }, 1000);
      });
    // }
  },
  // 验证用户手机号码
  getVerificationCode: function (e) {
    var that = this;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var phone = that.data.userPhone;
    var flag = reg.test(phone);
    if (flag) {
      that.getCode();
    }
    else {
      Toast({
        message: '请输入正确的手机号',
        selector: '#zan-toast-test'
      });
    }
  },
  // 获取用户手机号码
  getUserName: function (e) {
    var that = this;
      that.setData({
        username: e.detail.value
      });
      that.formVerity();
  },
  //获取数字验证码
  getUserID: function (e) {
    var that = this;
    that.setData({
      userid: e.detail.value
    });
    that.formVerity();
  },
  

  //验证3个数据是否填写完整
  formVerity: function () {
    var that = this
      , userid = that.data.userid
      , username = that.data.username
    if (userid.length == 18 && username != '') {
      that.setData({
        isFinished: true
      });
    }
  },
  //验证身份证号
  getBindphone:function(e){
    var that=this;
    that.setData({
      bindphone:e.detail.value
    });
    that.formVerity();
  },
  //提交数据登录
  login: function () {
    var that = this;
    if (that.data.valatedCode != that.data.codeImg.value) {
      Toast({
        message: '图片验证码输入错误',
        selector: '#zan-toast-test'
      });
    }
    else {
      wxb.Post(wxb.api.login, function (data) {
        if (data) {

        }
      });
    }
  },
  //注册帐号
  renzhen:function(e){
    var that=this;
    console.log(this.data);
    console.log(that.data.isFinished);
    if (that.data.isFinished==true){
      var timestamp = utils.formatTime(new Date());
      var uid = wx.getStorageSync('userinfo');
      var tokenSalt = 'HHsT52TYHF7mJtKe'; 
      var token = wx.getStorageSync("token");
      var str = token + timestamp + tokenSalt + uid;
      token = md5(md5(utils.sha1(md5(md5(str)))));
      wxb.Post(wxb.api.idCart, {
        Identity: that.data.userid,
        userName: this.data.username,
        token:token,
        Uid: wx.getStorageSync('userinfo'),
        timeStamp: timestamp,
      }, function (data) {
        console.log(data);
        wx.showModal({
          title: '',
          showCancel: false,
          content: '认证成功',
          confirmColor: "#FD8238",
          success(res) {
            wx.setStorageSync("userrz", 1);
            wx.navigateBack();
          }
        });
        // wx.navigateBack();
      });
    }else{
      Toast({
        message: '请输入将信息填写完整',
        selector: '#zan-toast-test'
      });
    }
  },
  //绑定帐号
  bindaccount:function(e){
    var bindphone = this.data.bindphone;
    if (bindphone == "" || bindphone==undefined){
      Toast({
        message: '请输入绑定手机号',
        selector: '#zan-toast-test'
      });
    }else{
      wxb.Post(wxb.api.bindaccount, {
        account: bindphone,
        appid:wx.getStorageSync("appid"),
      }, function (data) {
        // console.log(data);
        // return false;
        Toast({
          message: '绑定成功',
          selector: '#zan-toast-test'
        });
        wx.setStorageSync("userinfo", data.data);
        wx.setStorageSync("userauth", data.auth);
        wx.setStorageSync("token", data.token);
        wx.setStorageSync("isOrder", true);
        wx.setStorageSync("appid", wx.getStorageSync("appid"));
        wx.navigateBack();
      });
    }
  },
  //用户微信授权
  bindGetUserInfo: function (e) {
    Toast.loading({
      message: '登录中',
      selector: '#zan-toast-test',
      timeout: -500
    });
    wxb.login(function (res) {
      wx.setStorageSync("isOrder", true);
      wx.navigateBack();
    });
  }

})