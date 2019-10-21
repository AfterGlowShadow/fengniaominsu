// var json = [
//   { 
//     cityInfo:{
//       city_id: 41,
//       city_lat: 22.993887,
//       city_lng: 113.329556
//     },
//     name: "广州", 
//     province: '广东', 
//     result_type: {
//       id: 'dw',
//       icon: 'icon-xinxinicon',
//       name: '目的地',
//       color: '#FF6666'
//     } 
//   },
//   {
//     name: "公寓",
//     province: '广东',
//     address: '广州',
//     result_type: {
//       id: 'fx',
//       icon: 'icon-kezhangongyu',
//       name: '房型',
//       color: '#8B61CB'
//     }
//   },
//   {
//     cityInfo: {
//       city_id: 41,
//       city_lat: 22.993887,
//       city_lng: 113.329556
//     },
//     id: 39,
//     name: "汉溪长隆动物园",
//     province: '广东',
//     address: '广州',
//     result_type: {
//       id: 'jd',
//       icon:'icon-kanjingdian',
//       name: '观光景点',
//       color: '#44D39F'
//     }
//   },
//   {
//     cityInfo: {
//       city_id: 42,
//       city_lat: 22.62567,
//       city_lng: 113.816239
//     },
//     name: "深圳",
//     province: '广东',
//     result_type: {
//       id: 'dw',
//       icon: 'icon-xinxinicon',
//       name: '目的地',
//       color: '#FF6666'
//     }
//   },
//   {
//     id: 40,
//     name: "长隆商圈",
//     province: '广东',
//     address: '广州',
//     result_type: {
//       id: 'dt',
//       icon: 'icon-jiudian',
//       name: '商圈',
//       color: '#14B0FF'
//     }
//   },
//   {
//     id: 17,
//     lat: 22.993887,
//     lng: 113.329556,
//     name: "汉溪长隆酒店",
//     province: '广东',
//     address: '广州',
//     price: 100,
//     result_type: {
//       id: 'fw',
//       icon: 'icon-kezhangongyu',
//       name: '房屋',
//       color: '#F15EA6'
//     }
//   } 
// ]
var n_time;
var r_year;
var r_month;
var r_date;
var n_time_riqi;
var r_fount_month = 6;
var dayIndex = 0; 

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day, hour].map(formatNumber).join('')
}
// const formatTimeto = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()
//   return [year, month, day, hour].map(formatNumber).join('')
// }
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//查找数据并返回
function ClickToFind(val, json) {
  var eqx = new RegExp(val);
  var jsonList = JSON.parse(JSON.stringify(json))
  var arr = [];
  for (var i = 0; i < jsonList.length; i++) {
    if (eqx.exec(jsonList[i].name)) {
      arr.push(jsonList[i]);
    }
  }
  return arr;
}
//获取不同格式的日期显示
function getDay(time, x, addDayCount=0,can=2) {
  var t_time = new Date(time);
  t_time.setDate(t_time.getDate() + addDayCount);
  var t_year = t_time.getFullYear();
  var t_month = t_time.getMonth() + 1;
  t_month = t_month.toString();
  if (t_month.length == 1) {
    t_month = "0" + t_month;
  }
  var t_date = t_time.getDate();
  var t_date1 = t_date;
  t_date1 = t_date1.toString();
  if (t_date1.length == 1) {
    t_date1 = "0" + t_date;
  }
  var t_day = t_time.getDay();
  if (x == 1) {
    return t_date;
  } else if (x == 2) {
    return t_day;
  } else if (x == 3) {
    if (can==2){
      return t_month + "月" + t_date1 + "日";
    }else if(can==3){
      return t_year+"年"+t_month + "月" + t_date1 + "日";
    }
  } else {
    if (can == 2) {
      return t_month + "-" + t_date1;
    } else if (can == 3) {
      return t_year + "-" + t_month + "-" + t_date1;
    }
    
  }
}

//初始化日期json数据
function getDate(num, day, time, today) {
  var date = [];
  for (var i = 0; i < day; i++) {
    date.push({
      type: 0,
      day1: 0,
      day2: 0,
      select: 0,
      today: 0,
      dayIndex: dayIndex
    });
    dayIndex++;
  }
  if (today) {
    for (var j = 0; j <= ((parseInt(num / 7) + 1) * 7); j++) {
      if (j < today - 1) {
        date.push({
          type: 0,
          day1: getDay(time + 86400000 * j),
          day2: getDay(time + 86400000 * j, 1),
          day3: getDay(time + 86400000 * j, 3),
          select: 0,
          today: 0,
          dayIndex: dayIndex
        });
      } else if (j == today - 1) {
        date.push({
          type: 1,
          day1: getDay(time + 86400000 * j),
          day2: getDay(time + 86400000 * j, 1),
          day3: getDay(time + 86400000 * j, 3),
          select: 0,
          today: 1, //今天
          dayIndex: dayIndex
        });
      } else if (j > today - 1 && j < num) {
        date.push({
          type: 1,
          day1: getDay(time + 86400000 * j),
          day2: getDay(time + 86400000 * j, 1),
          day3: getDay(time + 86400000 * j, 3),
          select: 0,
          today: 0,
          dayIndex: dayIndex
        });
      } else {
        date.push({
          type: 0,
          day1: 0,
          day2: 0,
          day3: 0,
          select: 0,
          today: 0,
          dayIndex: dayIndex
        });
      }
      dayIndex++;
    }
  } else {
    for (var j = 0; j <= ((parseInt(num / 7) + 1) * 7); j++) {
      var local = [];
      if (j < num) {
        date.push({
          type: 1,
          day1: getDay(time + 86400000 * j),
          day2: getDay(time + 86400000 * j, 1),
          day3: getDay(time + 86400000 * j, 3),
          select: 0,
          today: 0,
          dayIndex: dayIndex
        });
      } else {
        date.push({
          type: 0,
          day1: 0,
          day2: 0,
          day3: 0,
          select: 0,
          today: 0,
          dayIndex: dayIndex
        });
      }
      dayIndex++;
    }
  }
  return date;
}
// 获取月份日历
function getMonthDate() {
  var datelist = [];
  var day, month;
  //初始化数据
  n_time = new Date();
  r_year = n_time.getFullYear();
  r_month = n_time.getMonth() + 1;
  r_date = n_time.getDate();
  n_time_riqi = r_year + "-" + r_month + "-" + r_date;
  dayIndex = 0;
  for (var z = 0; z < r_fount_month; z++) {
    var r_day = new Date(r_year + "/" + r_month + "/" + "1").getDay();  //获得本月一号的星期
    var n_time_s = new Date(r_year + "/" + r_month + "/" + "1").getTime();  //获得本月一号的毫秒数
    if (r_month == 12) {
      var n_time_date = new Date(new Date(r_year + 1 + "/1/1").getTime() - 86400000).getDate();  //获得本月的天数
    } else {
      var n_time_date = new Date(new Date(r_year + "/" + parseInt(r_month + 1) + "/" + "1").getTime() - 86400000).getDate();  //获得本月的天数
    }

    month = r_year + '/' + r_month;
    if (z == 0) {
      day = getDate(n_time_date, r_day, n_time_s, r_date);
    } else {
      day = getDate(n_time_date, r_day, n_time_s);
    }
    datelist.push({
      month: month,
      day: day,
    });
    if (r_month == 12) {
      r_month = 1;
      r_year++;
    } else {
      r_month++;
    }
  }
  return datelist;
}
//计算两个日期相差的天数
function DateDiff(sDate1, sDate2) {
  var aDate, oDate1, oDate2, iDays;
  aDate = sDate1.split("-");
  oDate1 = new Date(aDate[0] + '-' + aDate[1] );
  aDate = sDate2.split("-");
  oDate2 = new Date(aDate[0] + '-' + aDate[1] );
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
  return iDays;
}
//获取当前日期的相邻日期
function getDateStr(today, addDayCount) {    
  var dd;
  if (today) {
    dd = new Date(today);
  } else {
    dd = new Date();
  }
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  return y + "-" + m + "-" + d;
}
//验证身份证号码格式是否正确
function isCardID(sId) {
  var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" } 
  var iSum = 0;
  var info = "";
  if (!/^\d{17}(\d|x)$/i.test(sId)) return "证件号码位数不正确";
  sId = sId.replace(/x$/i, "a");
  if (aCity[parseInt(sId.substr(0, 2))] == null) return "证件号码格式不正确";
  let sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
  var d = new Date(sBirthday.replace(/-/g, "/"));
  if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "证件号码格式不正确";
  for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
  if (iSum % 11 != 1) return "证件号码格式不正确";
  return true;
}
//波浪效果画布
function canvasFct(){
  var ctx = wx.createCanvasContext("myCanvas")
  var ctx2 = wx.createCanvasContext("myCanvas2")
  var ctx3 = wx.createCanvasContext("myCanvas3")
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(40, 100, 500, 0)
  ctx.setStrokeStyle('rgba(255, 255, 255, 0)')
  ctx.setFillStyle('rgb(253,130,56)')
  ctx.fill()
  ctx.stroke()
  ctx.draw()

  //第二个
  ctx2.beginPath()
  ctx2.moveTo(0, 80)
  ctx2.quadraticCurveTo(100, -50, 500, 100)
  ctx2.setStrokeStyle('rgba(255, 255, 255, 0)')
  ctx2.setFillStyle('rgba(255, 255, 255, 0.178)')
  ctx2.fill()
  ctx2.stroke()
  ctx2.draw()

  //第三个
  ctx3.beginPath()
  ctx3.moveTo(0, 480)
  ctx3.quadraticCurveTo(100, -200, 400, 100)
  ctx3.setStrokeStyle('rgba(255, 255, 255, 0)')
  ctx3.setFillStyle('rgba(255, 255, 255, 0.178)')
  ctx3.fill()
  ctx3.stroke()
  ctx3.draw()
}
function encodeUTF8(s) {
  var i, r = [], c, x;
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
      if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
          r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
      else r.push(0xE0 + (c >> 12 & 0xF));
      r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
  return r;
};

// 字符串加密成 hex 字符串
function sha1(s) {
  var data = new Uint8Array(encodeUTF8(s))
  var i, j, t;
  var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
  s[l - 1] = data.length << 3;
  var w = [], f = [
    function () { return m[1] & m[2] | ~m[1] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; },
    function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; }
  ], rol = function (n, c) { return n << c | n >>> (32 - c); },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776];
  m[2] = ~m[0], m[3] = ~m[1];
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0);
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
        t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
        m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
    for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
  };
  t = new DataView(new Uint32Array(m).buffer);
  for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

  var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");

  return hex;
};
module.exports = {
  formatTime: formatTime,
  ClickToFind: ClickToFind,
  json: {},
  getDay: getDay,
  getDate: getDate,
  getMonthDate: getMonthDate,
  DateDiff: DateDiff,
  getDateStr: getDateStr,
  isCardID: isCardID,
  canvasFct: canvasFct,
  formatTime: formatTime,
  sha1: sha1
}
