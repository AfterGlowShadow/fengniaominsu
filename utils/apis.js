var apis = {
  index_banner: '/api/minsu.data/getBanner',    //首页背景图
  // Searh_house: '/api.php/Sel/data',    //房间列表
  Searh_house: '/api.php/Search/searchHousePage', 
  house_detail: '/api.php/House/HouseDetails',    //房屋详情
  create_order: '/api.php/Order/addOrder',   //创建订单
  order_detail: '/api.php/Order/orderDetalis',    //订单详情
  order_list: '/api.php/Order/viewOrder',    //订单列表
  captcha: '/api/login/captcha',    //获取验证码
  getLocation: '/api.php/Audit/get_id',    //获取定位城市
  query_place: '/api/minsu.index/searchMap',  //位置查询
  getConfig: '/api.php/Banner/banner?from=Home',   //首页小程序配置信息
  login: '/api.php/wxlogin/index',  //登录

  pay: '/api.php/Orderpay/WXPay',   //支付
  
  bindPicture: '/api/login/bind',  // 绑定用户头像
  cancle: '/api.php/Order/deleOrder',    //取消订单
  getPhone: '/api/login/getPhone',  //获取用户手机号码
  getSMS: '/api.php/Sms/sendSms',   //获取短信验证码
  bindPhone: '/api/login/bind',   //绑定用户手机
  upload: '/api/upload/upload',   //上传图片
  delImage: '/api/upload/delImage',    //删除上传图片
  comment: '/api/minsu.order/comment',    //提交评论
  getComment: '/api/minsu.index/getComment',   //获取评论信息
  getRecommend:'/api.php/index/index',
  register:'/api.php/Account/register',
  bindaccount: '/api.php/Account/bindaccount',
  idCart:'/api.php/Account/idCart',//身份认证(将身份证姓名进行认证)
  getUser:'/api.php/User/getUser',//获取用户的详细信息
  Advice:'/api.php/User/advice',//意见反馈
  About:'/api.php/About/about',//关于我们
  Contact:'/api.php/About/contact',//联系客服
  Showcollect:'/api.php/Collection/collect',//查看收藏
  Createcollect: '/api.php/Collection/addCollect',//添加收藏
  Deletecollect: '/api.php/Collection/deleCollect',//删除收藏
  ShowFeiLei:'/api.php/Index/allHouse',// 根据分类展示数据

  ShowFabuHouse:'/api.php/Audit/audit',//展示发布房源的信息
  FaBuHouse: '/api.php/House/add',//上传房源
  XiuGaiHoust:'/api.php/House/save',//修改房源
  HouseImg:'/api.php/House/addimg',//房源表头图片
  HouseImgs:'/api.php/House/xcx_addimgs',//房源详情图片
  HouseType:'/api.php/House/type',//房屋类型
  HouseLabels:'/api.php/House/labels',//房屋类别
  ShangChuHouse:'/api.php/Audit/delete',//删除房源
  HouseInfo:'/api.php/House/HouseDetails_user',//房屋详情
  DeleteImgs:'/api.php/House/DeleteImgs',//删除房源详细信息中的所有图片
  tuikuan: '/api.php/House/House_refund',//退款接口
  xuding:'/api.php/Wxxu/WXPay'//续订
}

module.exports = apis;