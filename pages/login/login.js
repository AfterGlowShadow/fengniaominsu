const Toast = require('../../components/dist/toast/toast');
var wxb = require('../../utils/wxb.js');
var app = getApp();

Page({
  data: {
    isLogin: true,
    fun_id:2,
    time: '获取验证码', //倒计时 
    currentTime:61,
    userPhone: '',   //手机号码
    valatedCode: '',  //图形验证码
    codeNum: '',  //数字验证码
    tabId: 0,
    pwd: '',
    repwd: '',
    disabled: false,
    imgUrl: '',
    sjn: 1100,
    squan:1,
    isFinished: false
  }, 
  onGotUserInfo: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wxb.Post(wxb.api.login, {
            code: res.code
          }, function (data) {
            console.log(data)
            if (data != "") {
              wx.setStorageSync("appid", data.appid);
              wx.setStorageSync("userinfo", data.data);
              wx.setStorageSync("userauth", 1);
              wx.setStorageSync("userrz", data.auth);
              wx.setStorageSync("token", data.token);
              wx.setStorageSync("isOrder", true);
              that.setData({
                squan: 1
              });
            } else {
              wx.showToast({
                title: '请确认微信权限，后再注册/绑定',
              })
            }
          });
        } else {
          wx.showToast({
            title: '拒绝了授权',
          })
        }
      }, fail: function () {
        wx.showToast({
          title: '获取信息失败，部分功能无法使用',
        })
      }
    });
  },
  onLoad: function (options) {
    var that = this;
    if(!(wx.getStorageSync('appid')&&wx.getStorageSync('appid')!="")){
      that.setData({
        squan: 0
      });
        // wx.login({
        //   success: function (res) {
        //     if (res.code) {
        //       wxb.Post(wxb.api.login, {
        //         code: res.code
        //       }, function (data) {
        //         console.log(data)
        //         if (data != "") {
        //           wx.setStorageSync("appid", data.appid);
        //           wx.setStorageSync("userinfo", data.data);
        //           wx.setStorageSync("userauth", 1);
        //           wx.setStorageSync("userrz", data.auth);
        //           wx.setStorageSync("token", data.token);
        //           wx.setStorageSync("isOrder", true);
        //           wx.navigateBack();
        //           that.setData({
        //             squan: 1
        //           });
        //         } else {
        //           wx.showToast({
        //             title: '请确认微信权限，后再注册/绑定',
        //           })
        //         }
        //       });
        //     } else {
        //       wx.showToast({
        //         title: '拒绝了授权',
        //       })
        //     }
        //   }, fail: function () {
        //     wx.showToast({
        //       title: '获取信息失败，部分功能无法使用',
        //     })
        //   }
        // });
    }
  },
  getUser: function () {
    wx.getUserInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo
        });
      }
    })
  },
  getBindphone: function (e) {
    var that = this;
    that.setData({
      bindphone: e.detail.value
    });
    that.formVerity();
  },
  //绑定帐号
  bindaccount: function (e) {
    var bindphone = this.data.bindphone;
    if (bindphone == "" || bindphone == undefined) {
      Toast({
        message: '请输入绑定手机号',
        selector: '#zan-toast-test'
      });
    } else {
      wxb.Post(wxb.api.bindaccount, {
        account: bindphone,
        appid: wx.getStorageSync("appid"),
      }, function (data) {
        // console.log(data);
        // return false;
        // Toast({
        //   message: '绑定成功',
        //   selector: '#zan-toast-test'
        // });
        wx.setStorageSync("userinfo", data.data);
        wx.setStorageSync("userauth", 1);
        wx.setStorageSync("userrz", data.auth);
        wx.setStorageSync("token", data.token);
        wx.setStorageSync("isOrder", true);
        wx.setStorageSync("appid", wx.getStorageSync("appid"));
        
        wx.showModal({
          title: '',
          showCancel: false,
          content: '绑定成功',
          confirmColor: "#FD8238",
          success(res) {
            wx.navigateBack();
          }
        });
        
      });
    }
  },
  //刷新图形验证码
  getImg: function () {
    this.setData({
      sjn: Math.random(100, 100000)
    });
  }, 
  getpwd: function (e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
    });
    that.formVerity();
  },
  getrepwd: function (e) {
    var that = this;
    that.setData({
      repwd: e.detail.value
    });
    that.formVerity();
  },
  //tab切换
  changeTab: function(){
    var that = this;
    var id = 0;
    if(that.data.tabId == 0)  id = 1;
    that.setData({
      tabId: id
    });
  },//注册帐号
  register: function (e) {
    var that = this;
    // console.log(this.data);
    // console.log(wx.getStorageSync('appid'));
    if (wx.getStorageSync('appid')!=""){
      if (this.data.userPhone == '' || this.data.userPhone == undefined) {
        Toast({
          message: '请输入手机号',
          selector: '#zan-toast-test'
        });
      } else if (this.data.codeNum == '' || this.data.codeNum == undefined) {
        Toast({
          message: '请输入验证码',
          selector: '#zan-toast-test'
        });
      } else if (this.data.pwd == '' || this.data.pwd == undefined) {
        Toast({
          message: '请输入密码',
          selector: '#zan-toast-test'
        });
      } else if (this.data.repwd == '' || this.data.repwd == undefined) {
        Toast({
          message: '请输入确认密码',
          selector: '#zan-toast-test'
        });
      } else if (this.data.pwd != this.data.repwd) {
        Toast({
          message: '确认密码与密码输入不一致',
          selector: '#zan-toast-test'
        });
      } else {
        Toast.loading({
          message: '注册中',
          selector: '#zan-toast-test',
          timeout: -500
        });
        wxb.Post(wxb.api.register, {
          account: that.data.userPhone,
          verificationCode: this.data.codeNum,
          password: that.data.pwd,
          appid: wx.getStorageSync("appid"),
          from: "register"
        }, function (data) {
          console.log(data);
          wx.setStorageSync("userinfo", data.data);
          wx.setStorageSync("userauth", 0)
          wx.setStorageSync("isOrder", true);
          wx.navigateBack();
        });
      }
    }else{
      Toast.loading({
        message: '缺少授权，请退出后授权',
        selector: '#zan-toast-test',
        timeout: -500
      });
    }
  },
  //验证码倒计时
  getCode: function (options){
    var that = this;
    var currentTime = that.data.currentTime;
    // if(that.data.valatedCode == ''){
    //   Toast({
    //     message: '请先输入图形验证码',
    //     selector: '#zan-toast-test'
    //   });
    // }
    // else{
      wxb.Post(wxb.api.getSMS, {
        account: that.data.userPhone,
        checkCode: "g4sd24f2d4s2s25fd2w1gf25g1d2z52s",
        from: "register"
      }, function(data){
        console.log(data);
        // if(data.msg=="用户已注册"){
        //   wx.showToast({
        //     title: '使用此账号需要绑定',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
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
  getVerificationCode: function(e){
    var that = this;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var phone = that.data.userPhone;
    var flag = reg.test(phone);
    if(flag){
      that.getCode();
    }
    else{
        Toast({
          message: '请输入正确的手机号',
          selector: '#zan-toast-test'
        }); 
    }
  },
  // 获取用户手机号码
  getUserPhone: function(e){
    var that = this;
    that.setData({
      userPhone: e.detail.value
    });
    that.formVerity();
  }, 
  //获取数字验证码
  getCodeNum: function(e){
    var that = this;
    that.setData({
      codeNum: e.detail.value
    });
    that.formVerity();
  },
  // 获取图片验证码
  getValatedCode: function (e) {
    var that = this;
    that.setData({
      valatedCode: e.detail.value
    });
    that.formVerity();
  }, 
  //验证3个数据是否填写完整
  formVerity: function(){
    var that = this
    ,phone = that.data.userPhone
    ,codeNum = that.data.codeNum
    ,valatedCode = that.data.valatedCode;
    if(phone.length == 11 && codeNum != '' && valatedCode != ''){
      that.setData({
        isFinished: true
      });
    }
  },
  //提交数据登录
  login: function(){
    var that = this;
    if(that.data.valatedCode != that.data.codeImg.value){
      Toast({
        message: '图片验证码输入错误',
        selector: '#zan-toast-test'
      });
    }
    else{
      wxb.Post(wxb.api.login, function(data){
        if(data){

        }
      });
      // console.log({
      //   phone: that.data.userPhone,
      //   codeNumber: that.data.codeNum
      // })
    }
  },
  //手机号授权
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny'){
      this.setData({
        tabId: 1
      });
    }
    else{
      // 手机号登录
      Toast.loading({
        message: '登录中',
        selector: '#zan-toast-test',
        timeout: -500
      });
      // wx.login({
      //     success: function (res) {
      //       if (res.code) {
      //         wxb.Post(wxb.api.login, {
      //           code: res.code
      //         }, function (data) {
      //           // wxb.Post(wxb.api.getPhone, { 
      //           //   sessionKey: data.calback.session_key,
      //           //   iv: e.detail.iv,
      //           //   encryptedData: e.detail.encryptedData   
      //           // }, function(data2){
      //           //   if(data2.phoneNumber){
      //           //     wx.setStorageSync("userinfo", JSON.stringify(data));
      //           //     wx.setStorageSync("isOrder", true);
      //           //     wx.navigateBack();
      //           //   }
      //           // })
      //           console.log("tian");
      //           console.log(data);
      //           wx.setStorageSync("userinfo", JSON.stringify(data)[data]);
      //           wx.setStorageSync("userauth", data.auth)
      //           wx.setStorageSync("isOrder", true);
      //           wx.navigateBack();
      //         });
      //       } else {
      //         wx.showToast({
      //           title: '拒绝了授权',
      //         })
      //       }
      //     }
      // });
    }
  },
  //用户微信授权
  bindGetUserInfo: function(e){
      Toast.loading({
        message: '登录中',
        selector: '#zan-toast-test',
        timeout: 500
      });
      wxb.login(function (res) {
        console.log(res)
        if ((wx.getStorageSync("userinfo") == "" || wx.getStorageSync("userinfo") == 0) && wx.getStorageSync("userauth") == "" || wx.getStorageSync("userauth") == 0) {
          wx.showToast({
            title: '请先注册账号后登陆',
            icon: 'none',
            duration: 2000
          })
          this.changeTab();
        } else {
          wx.setStorageSync("isOrder", true);
          wx.navigateBack();
        }
      });
    }
})