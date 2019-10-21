// pages/profile/fangyuan/fabu/fabu.js
const Toast = require('../../../../components/dist/toast/toast');
var md5 = require('../../../../utils/md5.min.js');
var utils = require('../../../../utils/util.js');
var wxb = require('../../../../utils/wxb.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onebackground:"../../../../img/profile/fangyuan/onebackground.png",
    onebutton:"../../../../img/profile/fangyuan/onebutton.png",
    addimglist:"../../../../img/profile/fangyuan/imglist.png",
    region: '',
    area_id:"",
    address:"",
    biaoqian:"",
    xiangqiang:"",
    lianxiren:"",
    oneimg:"",
    imglist:[
      {src:"../../../../img/profile/fangyuan/imglist.png"}
    ],
    name:"",
    pro_name: "",
    city_name: "",
    area_name: "",
    fangyuanlx:0,//房源类型
    jishi:"",//几室
    jiting:"",//几厅
    jiren:"",//能住几人
    chuangleixing: '大床',//床类型
    mianji:"",//面积
    zhujin:"",//租金
    title:"",//房源标题
    description:"",//房源描述

    inputxinxiShow:false,
    inputBoxShow: false,
    xiangqingtitle:"请描述房源基本信息",
    bioaqiantitle: "添加房源标签",
    riderCommentList: "",
    fylx:"房源类型",
    cleixing:"选择床类型",
    fleixing:"",
    cleixinglist: [
      { id: 2, name: '大床' },
      { id: 3, name: '小床' },
    ],
    flx_index: 0,
    clx_index:0
  },
  //选择图片方法
uploadonepic: function (e) {
  var that = this //获取上下文
  var oneimg = that.data.oneimg
  //选择图片
  wx.chooseImage({
    count: 8, 
    sizeType: ['compressed'], 
    sourceType: ['album', 'camera'],
    success: function (res) {
      var tempFiles = res.tempFiles;
      //把选择的图片 添加到集合里
        oneimg=tempFiles;
      //显示
      that.setData({
        onebackground:oneimg[0].path,
        oneimg: oneimg,
        onebutton:"",
      });
    }
  })
},
  previewImg:function(){
    console.log('tian');
  },
  shangchuan: function (url,h_id=""){
    var data = [];
    var timestamp = utils.formatTime(new Date());
    var tokenSalt = 'HHsT52TYHF7mJtKe';
    var token = wx.getStorageSync("token");
    var uid = wx.getStorageSync("userinfo");
    var str = token + timestamp + tokenSalt + uid;
    token = md5(md5(utils.sha1(md5(md5(str)))));
    data['token'] = token;
    data['Uid'] = wx.getStorageSync('userinfo');
    data['timeStamp'] = timestamp;
    data['h_id'] = h_id;
    wxb.uploadfileserver(url,this,this.data.oneimg,0,data,function(data){
      if (data != 1) {
        return 0;
      }else{
        return 1;
      }
    });
  },
  shangchuanlist:function(url,h_id){
    var data = [];
    var timestamp = utils.formatTime(new Date());
    var tokenSalt = 'HHsT52TYHF7mJtKe';
    var token = wx.getStorageSync("token");
    var uid = wx.getStorageSync("userinfo");
    var str = token + timestamp + tokenSalt + uid;
    token = md5(md5(utils.sha1(md5(md5(str)))));
    data['token'] = token;
    data['Uid'] = wx.getStorageSync('userinfo');
    data['timeStamp'] = timestamp;
    data['h_id'] = h_id;
    var imglist=this.data.imglist;
    imglist.splice(0, 1);
    var temp=1;
    for (var index in imglist){
      wxb.uploadfileserver(url, this, imglist, index, data, function (data) {
        if(data!=1){
          return 0;
        }
      });
    }
    return 1;
  },
   // 删除图片
deleteImg: function(e) {
  let imglist = this.data.imglist;
  let index = e.currentTarget.dataset.index;
  imglist.splice(index, 1);
  this.setData({
    imglist: imglist
  });
},
  submit:function(){
    if (this.data.oneimg==""){
      wx.showToast({
        title: '请添加标题图片',
        icon: 'success',
        duration: 500
      })
    }else{
      if(this.data.imglist.length>1){
        var fyinfo=[];
        var that=this;
        var timestamp = utils.formatTime(new Date());
        var tokenSalt = 'HHsT52TYHF7mJtKe';
        var token = wx.getStorageSync("token");
        var uid = wx.getStorageSync("userinfo");
        var str = token + timestamp + tokenSalt + uid;
        token = md5(md5(utils.sha1(md5(md5(str)))));
        fyinfo['token'] = token;
        fyinfo['mid'] = wx.getStorageSync('userinfo');
        fyinfo['timeStamp'] = timestamp;
        fyinfo['h_owners_phone'] = this.data.lianxiren;
        fyinfo['h_room_num'] = this.data.jishi;
        fyinfo['h_hall_num'] = this.data.jiting;
        fyinfo['h_area'] = this.data.mianji;
        fyinfo['h_bed'] = this.data.chuangleixing;
        fyinfo['h_present_price'] = this.data.zhujin;
        fyinfo['h_number'] = this.data.jiren;
        fyinfo['h_housename'] = this.data.title;
        fyinfo['h_maintext'] = this.data.description;
        fyinfo['h_label'] = this.data.biaoqian;
        fyinfo['type_id'] = this.data.fangyuanlx;
        fyinfo['h_location'] = this.data.address;
        fyinfo['h_province'] = this.data.pro_name;
        fyinfo['h_city'] = this.data.city_name;
        fyinfo['h_districts'] = this.data.area_name;
        fyinfo['h_owners'] = this.data.name;
        fyinfo['h_longitude'] = wx.getStorageSync('longitude');
        fyinfo['h_latitude'] = wx.getStorageSync('latitude');
        fyinfo['h_imgurl'] ="";
        //这几个参数没有 data也没有 另外没有判断这些参数是否存在
          //题图图片(单张)这个是先上传获得路径后,厚的路径地址
        //上传方法
        wxb.Post(wxb.api.FaBuHouse, fyinfo, function (res) {
          console.log(res);
          if (res !== "" && res !== 0 && res !=="/api.php/House/addimg"){
            console.log(that.shangchuan(wxb.api.HouseImg, res));
            console.log(that.shangchuanlist(wxb.api.HouseImgs, res));
          }
        });
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 500
        })
        wx.navigateBack({ changed: true });
        console.log("tna");
      }else{
        wx.showToast({
          title: '添加详情图片',
          icon: 'success',
          duration: 500
        })
      }
    }
  },
  
  getjishi: function (e) {
    if (!isNaN(e.detail.value)) {
      this.setData({
        jishi: e.detail.value
      });
    } else {
      wx.showToast({
        title: '请先输入数字',
        icon: 'success',
        duration: 500
      })
    }
  },
  getjiting: function (e) {
    if (!isNaN(e.detail.value)) {
      this.setData({
        jiting: e.detail.value
      });
    } else {
      wx.showToast({
        title: '请先输入数字',
        icon: 'success',
        duration: 500
      })
    }
  },
  getjiren: function (e) {
    if (!isNaN(e.detail.value)) {
      this.setData({
        jiren: e.detail.value
      });
    } else {
      wx.showToast({
        title: '请先输入数字',
        icon: 'success',
        duration: 500
      })
    }
  }, 
  getmianji: function(e) {
    if (!isNaN(e.detail.value)) {
      this.setData({
        mianji: e.detail.value
      });
    } else {
      wx.showToast({
        title: '请先输入数字',
        icon: 'success',
        duration: 500
      })
    }
  },
  getzhujin: function (e) {
    if (!isNaN(e.detail.value)) {
      this.setData({
        zhujin: e.detail.value
      });
    } else {
      wx.showToast({
        title: '请先输入数字',
        icon: 'success',
        duration: 500
      })
    }
  },
  gettitle: function (e) {
    this.setData({
      title: e.detail.value
    });
  },
  getdescription: function (e) {
    this.setData({
      description: e.detail.value
    });
  },
  xq_quxiao:function(){
    this.setData({
      // fangyuanlx: 0,//房源类型
      // jishi: 0,//几室
      // jiting: 0,//几厅
      // jiren: 0,//能住几人
      // chuangleixing: 0,//床类型
      // mianji: 0,//面积
      // zhujin: 0,//租金
      // title: "",//房源标题
      // description: "",//房源描述
      inputxinxiShow:false,
      xiangqingtitle:"详情添加完毕"
      // flx_index: 0,
      // clx_index: 0,
    })
  },
   uploadpics: function (e) {
    console.log(e);
    var that = this //获取上下文
    var imglist = that.data.imglist
    //选择图片
    wx.chooseImage({
      count: 8,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          tempFiles[i]['src'] = tempFiles[i].path;
          imglist.push(tempFiles[i])
        }
        console.log(imglist);
        //显示
        that.setData({
          imglist: imglist,
        });
      }
    })
  },
  xq_queding:function(){
  
   if(this.data.jishi==0){
     wx.showToast({
       title: '请先输入几室',
       icon: 'error',
       duration: 500
     })
    }else if(this.data.jiting==0){
     wx.showToast({
       title: '请先输入几厅',
       icon: 'error',
       duration: 500
     })
    }else if(this.data.mianji==0){
     wx.showToast({
       title: '请先输入房源面积',
       icon: 'error',
       duration: 500
     })
    }else if(this.data.title==""){
     wx.showToast({
       title: '请先输入房源标题',
       icon: 'error',
       duration: 500
     })
    }else if(this.data.description==""){
     wx.showToast({
       title: '请先输入房源详情',
       icon: 'error',
       duration: 500
     })
    }else{
      this.setData({
        inputxinxiShow: false,
        xiangqingtitle: "房源信息填写完成"
      })
    }
  },

  fyleixing_change: function (e) {
    this.setData({   //给变量赋值
      flx_index: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
      fangyuanlx: this.data.fleixing[e.detail.value]
    })
  },
  chuangleixing_change: function (e) {
    this.setData({   //给变量赋值
      clx_index: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
      chuangleixing: this.data.cleixinglist[e.detail.value]
    })
  },
  bindViewEvent: function (e) {
    // wx.setStorageSync("index_dataList", JSON.stringify(e.detail.value));
    this.setData({
      region: e.detail.value,
      pro_name:e.detail.value[0],
      city_name:e.detail.value[1],
      area_name:e.detail.value[2]
    })
    // var weizi = e.detail.value;
    // weizi['pro_name'] = weizi[0];
    // weizi['city_name'] = weizi[1];
    // weizi['area_name'] = weizi[2];
    // console.log(weizi);
    // this.getPlace(weizi);
  },
  //获得地址的编号
  // getPlace(weizi){
  //   var that=this;
  //   wxb.Post(wxb.api.getLocation, weizi, function (data) {
  //     that.setData({
  //       area_id:data
  //     })
  //   });
  // },
  //获取用户基本信息
  getUser(){
    //用户个人详细信息
    var that=this;
    var timestamp = utils.formatTime(new Date());
    var uid = wx.getStorageSync('userinfo');
    var tokenSalt = 'HHsT52TYHF7mJtKe';
    var token = wx.getStorageSync("token");
    var str = token + timestamp + tokenSalt + uid;
    token = md5(md5(utils.sha1(md5(md5(str)))));
    wxb.Post(wxb.api.getUser, {
      token: token,
      Uid: wx.getStorageSync('userinfo'),
      timeStamp: timestamp,
    }, function (data) {
      console.log(data);
      // 请求相关房屋信息
      that.setData({
        lianxiren: data.Account,
        name:data.Name,
      })
    });
  },
  //获得详细地址
  getaddress: function (e) {
    console.log(e.detail.value);
    this.setData({
      address: e.detail.value
    });
  },



  //房源类型获取
  gylxinit:function(){
    var that=this;
    wxb.Post(wxb.api.HouseType, {
    }, function (data) {
      var fleixing = [];
      for (var index in data) {
        fleixing[index] = {};
        fleixing[index].id = data[index].type_id;
        fleixing[index].name = data[index].type_name;
      }
      that.setData({
        fleixing: fleixing
      })
    });
  },




  //房源详情
  xiangqing: function (e) {
    this.gylxinit();
    this.setData({
      inputxinxiShow:true
    })
  },
  //房源标签
  biaoqian: function (e) {
    if (this.data.riderCommentList==""){
      this.getbiaoqian();
    }
    this.setData({
      inputBoxShow:true
    })
  },
  
  //标签取消
  bq_quxiao:function(e){
    this.setData({
      inputBoxShow:false
    })
  },
  //标签确定
  bq_queding:function(e){
    this.setData({
      biaoqian: this.data.biaoqiantemp,
      inputBoxShow: false
    })
    if (this.data.biaoqian==""){
      this.setData({
        bioaqiantitle: "请描述房源基本信息",
      })
    }else{
      this.setData({
        bioaqiantitle: "房源基本信息以填写" ,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var region = [];
    region.push(wx.getStorageSync('pro_name'));
    region.push(wx.getStorageSync('city_name'));
    region.push(wx.getStorageSync('area_name'));
    this.setData({
      region: region,
      pro_name: wx.getStorageSync('pro_name'),
      city_name: wx.getStorageSync('city_name'),
      area_name: wx.getStorageSync('area_name'),
      area_id:wx.getStorageSync('area_id')
    });
    this.getUser();
  },
  getbiaoqian:function(){
    var that=this;
    wxb.Post(wxb.api.HouseLabels, {
    }, function (data) {
      var riderCommentList=[];
      for (var index in data) {
        riderCommentList[index] = {};
        riderCommentList[index].value = data[index].label_id;
        riderCommentList[index].title = data[index].label_name;
        riderCommentList[index].selected=false;
      }
      that.setData({
        riderCommentList:riderCommentList
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

  },
  checkboxChange(e) {
    console.log('checkboxChange e:', e);
    let string = "riderCommentList[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.riderCommentList[e.target.dataset.index].selected
    })
    let detailValue = this.data.riderCommentList.filter(it => it.selected).map(it => it.value)
    console.log('所有选中的值为：', detailValue)
    this.setData({
      biaoqiantemp:detailValue
    })
  },
})