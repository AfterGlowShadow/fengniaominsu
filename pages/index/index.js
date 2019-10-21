//index.js
//获取应用实例
var utils = require("../../utils/util.js");
var wxb = require('../../utils/wxb.js');  //API接口请求核心文件
var bmap = require('../../utils/bmap-wx.min.js');    //引入百度地图SDK
let year = new Date().getFullYear();
let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
let date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
let starttime = year + "-" + month + "-" + date;
const app = getApp();

Page({
  data: {
    ak: 'CKpGeZ2wsdylTqPBdKFrPISUfGF7XGa1',
    bannerList: [],
    src: '',
    motto: '休息，休息一下~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    region: '',

    cityInfo: {
      city_id: '',
      city_name: '',
      city_lat: '',
      city_lng: ''
    },
    place: '',
    bg_date: '',
    end_date: '',
    days: '1',
    peopleNum: '不限人数',
    isHide: true,
    current: 0,
    guanggao:[],
    recommendList: [],
    fenleiList:[]
  },

  onLoad: function (options) {
    
    // if (wx.getStorageSync("wxb_bg_end_date")) {
   
    // console.log(JSON.parse(wx.getStorageSync("wxb_bg_end_date")));
      
    if (wx.getStorageSync("wxb_bg_end_date")) {
      var time = JSON.parse(wx.getStorageSync("wxb_bg_end_date"))
    } else {
      var time = {};
    }
    time['bg_date'] = utils.getDay(new Date(), 4, 0, 3);
    time['bg_date1'] = utils.getDay(new Date(), 3, 0, 2);
    time['sebg_date'] = utils.getDay(new Date(), 4, 0, 3);
    time['sebg_date1'] = utils.getDay(new Date(), 3, 0, 2);
    time['search_day2']=1;
    time['day'] = 0;
    time['day2'] = 1;
    time['seend_date'] = utils.getDay(new Date(), 4, 1, 3);
    time['seend_date1'] = utils.getDay(new Date(),3, 1, 2);
    time['end_date'] = utils.getDay(new Date(), 4, 1, 3);
    time['end_date1'] = utils.getDay(new Date(), 3, 1, 2);
    wx.setStorageSync("wxb_bg_end_date", JSON.stringify(time));
    // }

    var that = this;
    //请求一张首页的背景图片
    that.get_bgImg();
    var bg_date = month + '月' + date + '日';
    var end_date = utils.getDateStr(starttime, 1).slice(5, 7) + '月' + utils.getDateStr(starttime, 1).slice(8, 10) + '日';
    that.setData({
      bg_date: bg_date,
      end_date: end_date
    });
   
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.login({ 
            success: function (res) {
              if (res.code) {
                wxb.Post(wxb.api.login, {
                  code: res.code
                }, function (data) {
                  if (data.data!=""){
                    wx.setStorageSync("appid", data.appid);
                    wx.setStorageSync("userinfo", data.data);
                    wx.setStorageSync("userauth", 1);
                    wx.setStorageSync("userrz", data.auth);
                    wx.setStorageSync("token", data.token);
                    wx.setStorageSync("isOrder", true);
                    wx.navigateBack();
                  }
                });
              } else {
                wx.showToast({
                  title: '拒绝了授权',
                })
              }
            },fail:function(){
              
              wx.showToast({
                title: '获取信息失败，部分功能无法使用',
              })
            }
          });
        }
      }
    });
    // return false;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.getPlace();
  },
  onShow: function () {
    var that = this;
    if (wx.getStorageSync('wxb_bg_end_date')) {
      var dateList = JSON.parse(wx.getStorageSync('wxb_bg_end_date'))
      console.log(dateList);

      that.setData({
        bg_date: dateList.sebg_date1,
        end_date: dateList.seend_date1,
        days: dateList.search_day2
      })
    }
    if (wx.getStorageSync("selectNum")) {
      var num = wx.getStorageSync("selectNum")
      that.setData({
        peopleNum: num
      });
    }
    if (wxb.getCity()) {
      var city = {
        city_id: wxb.getCity().city_id,
        city_name: wxb.getCity().city_name,
        city_lat: wxb.getCity().city_lat,
        city_lng: wxb.getCity().city_lng
      }
      that.setData({
        cityInfo: city,
        place: ''
      });
    }
    wx.removeStorageSync("filter_num");
  },
  //点击查找房屋进行跳转
  search(){
    var that = this;
    wx.setStorageSync("index_dataList", JSON.stringify(this.data.region));
    wx.navigateTo({
      url: '/pages/houseList/houseList'
    });
  },
  //获取定位城市信息
  getPlace(){
    var that = this;
    wx.getLocation({
      success: function (res) {
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
        var l = res.latitude + ',' + res.longitude;
        var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
        var qqmapsdk = new QQMapWX({
          key: 'N2OBZ-EEBWX-DHS4R-7SZC6-MDXUK-RTB62' // 必填
        });  
          var _this = this;
          qqmapsdk.reverseGeocoder({
            //位置坐标，默认获取当前位置，非必须参数
             //Object格式
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
            success: function (res) {//成功后的回调
              console.log(res);
              var res = res.result;
              var mks = [];
              mks.push({ // 获取返回结果，放到mks数组中
                title: res.address,
                id: 0,
                latitude: res.ad_info.location.lat,
                longitude: res.ad_info.location.lng,
                iconPath: './resources/placeholder.png',//图标路径
                width: 20,
                height: 20,
                callout: { //在markers上展示地址名称，根据需求是否需要
                  content: res.address,
                  color: '#000',
                  display: 'ALWAYS'
                }
              });
            },
            fail: function (error) {
              console.error(error);
            },
            complete: function (res) {
              var province=res.result.address_component.province;
              var city=res.result.address_component.city;
              var district=res.result.address_component.district;
              var weizi=[];
              wx.setStorageSync('pro_name', province);
              wx.setStorageSync('city_name', city);
              wx.setStorageSync('area_name', district);
              var region=[];
              region.push(province);
              region.push(city);
              region.push(district);
              that.setData({
                region: region
              });
              var weizi=[];
              weizi['pro_name']=province;
              weizi['city_name']=city;
              weizi['area_name']=district;
              that.getTuijian(weizi);
            }
          })
          
      }
    });

  },
  getTuijian(weizi){
    var that=this;
    wxb.Post(wxb.api.getLocation, weizi, function (data) {
      var tuijian = [];
      wx.setStorageSync("area_id", data);
      tuijian['area_id'] = data;
      tuijian['Count'] = 3;
      wxb.Post(wxb.api.getRecommend, tuijian, function (data) {
        var fenleiList = [];
        for (var index1 in data.TypeDatas) {
          fenleiList[index1]={};
          fenleiList[index1].Id = data.TypeDatas[index1].typeId;
          fenleiList[index1].title = data.TypeDatas[index1].typeName;
          fenleiList[index1].imageURL = data.TypeDatas[index1].ImageUrl;
          // fenleiList[index1]=items1;
          // console.log(items1);
        }

        var recommend = [];
        for (var index in data.RecommendedDatas) {
          recommend[index]={};
          recommend[index].Id = data.RecommendedDatas[index].houseId;
          var housename = data.RecommendedDatas[index].HouseName;
          if (housename.length > 13) {
            recommend[index].title = housename.substr(0, 13)+ "...";
          } else {
            recommend[index].title = data.PreferentialDatas[index].HouseName;
          }
          // recommend[index].title = data.RecommendedDatas[index].HouseName;
          recommend[index].imageURL = data.RecommendedDatas[index].ImageUrl;
          recommend[index].presentPrice = data.RecommendedDatas[index].presentPrice;
          recommend[index].originalPrice = data.RecommendedDatas[index].originalPrice;
        }
        var Thlist=[];
        for (var index in data.PreferentialDatas) {
          Thlist[index] = {};
          Thlist[index].Id = data.PreferentialDatas[index].houseId;
          var housename=data.PreferentialDatas[index].HouseName;
          if(housename.length>13){
            Thlist[index].HouseName = housename.substr(0, 13) + "\n" + housename.substr(13, 10)+"...";
          }else{
            Thlist[index].HouseName = data.PreferentialDatas[index].HouseName;
          }
          Thlist[index].imageURL = data.PreferentialDatas[index].ImageUrl;
          Thlist[index].presentPrice = data.PreferentialDatas[index].presentPrice;
          Thlist[index].originalPrice = data.PreferentialDatas[index].originalPrice;
        }
        that.setData({
          isHide: true,
          recommendList: recommend,
          fenleiList: fenleiList,
          Thlist: Thlist
        });
      }, 'Get')
    });
  },
  //地址更改
  bindViewEvent:function(e){
    // console.log(e.detail.value);
    wx.setStorageSync("index_dataList", JSON.stringify(e.detail.value));
    this.setData({
      region: e.detail.value
    })
    // var wztemp = JSON.parse(wx.getStorageSync("index_dataList"));
    var weizi = e.detail.value;
    weizi['pro_name'] = weizi[0];
    weizi['city_name'] = weizi[1];
    weizi['area_name'] = weizi[2];
    console.log(weizi);
    this.getTuijian(weizi);
  },
  // 获取定位具体位置
  getLocation: function(){
    var that = this;
    that.setData({
      isHide: false
    });
    that.getPlace();
  },
  //点击城市跳转到选择城市页面
  navigatorToCity(){
    var that = this
    var city = that.data.cityInfo.city_name
    wx.navigateTo({
      url: 'city/city?city=' + city,
    })
  },
  //获取个人信息授权
  getUserInfo: function(e) { 
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //跳转到分类页面
  FenLei_navigater(e){
    var postad = e.currentTarget.dataset.postad;  //获取传递的值
    var fenlei_name = e.currentTarget.dataset.path;  
    var src = e.currentTarget.dataset.src;
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: 'fenlei/fenlei?fenlei_type=' + postad + "&fenlei_name=" + fenlei_name+"&beijing="+src
    })
  },
  //跳转到推荐更多页面
  TJgd_navigater(e){
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: 'gengduo/gengduo?fenlei_type=RecommendedHousing&fenlei_name=推荐房源'
    })
  },
  //跳转到特会更多界面
  THgd_navigater(e){
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: 'gengduo/gengduo?fenlei_type=PreferentialHousing&fenlei_name=特惠房源'
    })
  },
  //获取首页背景图
  get_bgImg: function () {
    var that = this;
    
    wxb.Post(wxb.api.getConfig, {}, function (data) {
      var banner=[];
      var link=[];
      var imagename=[];
      for(var items in data.bannerDatas){
        banner.push(data.bannerDatas[items]['imageUrl']);
        link.push(data.bannerDatas[items]['link']);
        imagename.push(data.bannerDatas[items]['imageName']);
      }
      var guanggao=[];
      for(var items in data.advertisingDatas){
        guanggao.push(data.advertisingDatas[items]);
      }
      console.log(guanggao);
      if(banner){
        that.setData({
          src: link,
          bannerList: banner,
          recommendList: imagename,
          guanggao: guanggao
        });
        if(data.app_name){
          wx.setNavigationBarTitle({
            title: data.app_name,
          });
        }
        wx.setStorageSync("app_info", data);
      }
    });
  },
  //今日推荐swiper图片当前下标
  bindchange(e) {
    this.setData({
      current: e.detail.current
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync("app_info").app_name,
      path: '/pages/index/index?userid=' + JSON.parse(wx.getStorageSync("userinfo")).user_id
    }
  },
  // 推荐图片点击跳转
  navigatorToPhoto: function(e){
    var path = e.currentTarget.dataset.path;
    if(path != ''){
      wx.navigateTo({
        url: path,
      });
    }
  },
  // 首页活动跳转
  toActivity: function (){
    wx.showModal({
      title: '提示',
      content: '活动尚未开始，敬请期待！',
      showCancel: false,
      confirmColor: '#FD8238'
    })
  },
  toHouseinfo:function(event){
    var postad = event.currentTarget.dataset.postad   //获取传递的值
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: '../houseDetail/houseDetail?room_id=' + postad
    })
  }
})
