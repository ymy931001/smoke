import http from "./tools";


// export const url = 'http://192.168.1.228:8081';
// export const url = 'http://192.168.1.224:8088/zs/smoke';
// export const url = 'http://47.110.248.244:8081';
// export const url = 'http://121.41.8.207:8081';
// export const url = 'http://192.168.3.9:8088/zs/smoke';
// export const url = 'http://121.41.8.207:8088/zs/smoke';
export const url = 'http://47.98.110.30:8088/zs/smoke';
// export const url = 'https://filing.terabits.cn:8000';



//登录
export const login = params =>
  http.get(url + "/login", {
    username: params[0],
    password: params[1],
  });


//告警管理
export const getalarmList = params =>
  http.get(url + "/api/v1/alarm/getList", {
    access_token: params[0],
    deviceType: params[1],
    provinceId: params[2],
    cityId: params[3],
    districtId: params[4],
    unitId: params[5],
    deviceId: params[6],
    pageNum: params[7],
    pageSize: params[8],
    beginTime: params[9],
    endTime: params[10],
    unitType: params[11],
  });


//单位管理
export const getunitList = params =>
  http.get(url + "/api/v1/unit/getList", {
    access_token: params[0],
    unit: params[1],
  });

//设备管理
export const getdeviceList = params =>
  http.get(url + "/api/v1/device/getList", {
    access_token: params[0],
    deviceType: params[1],
    provinceId: params[2],
    cityId: params[3],
    districtId: params[4],
    unitId: params[5],
    deviceId: params[6],
  });

//账号管理
export const getaccount = params =>
  http.get(url + "/api/v1/admin/account/get", {
    access_token: params[0],
    provinceId: params[1],
    cityId: params[2],
    districtId: params[3],
    unitId: params[4],
    keyword: params[5],
  });


//角色管理
export const getrole = params =>
  http.get(url + "/api/v1/admin/role/get", {
    access_token: params[0],
  });

//添加角色
export const addrole = params =>
  http.post(url + "/api/v1/admin/role/add", {
    access_token: params[0],
    name: params[1],
  });

//删除角色
export const deleterole = params =>
  http.post(url + "/api/v1/admin/role/delete", {
    access_token: params[0],
    roleId: params[1],
  });

//获取所有权限
export const getmenu = params =>
  http.get(url + "/api/v1/admin/menu/get", {
    access_token: localStorage.getItem('token'),
    name: params[0],
  });

//获取角色拥有权限
export const getroleMenu = params =>
  http.get(url + "/api/v1/admin/roleMenu/get", {
    access_token: localStorage.getItem('token'),
    name: params[0],
  });

//修改角色权限
export const updateroleMenu = params =>
  http.post(url + "/api/v1/admin/roleMenu/update", {
    access_token: localStorage.getItem('token'),
    menuIds: params[0],
    roleId: params[1],
  });




//获取当前账户级联
export const getunitTree = params =>
  http.get(url + "/api/v1/admin/unitTree/get", {
    access_token: params[0],
  });


//添加用户
export const addaccount = params =>
  http.post(url + "/api/v1/admin/account/add", {
    access_token: params[0],
    roleId: params[1],
    provinceId: params[2],
    cityId: params[3],
    districtId: params[4],
    unitId: params[5],
    userName: params[6],
    password: params[7],
    realName: params[8],
    phone: params[9],
    email: params[10],
  });


//修改用户信息
export const changeaccount = params =>
  http.post(url + "/api/v1/admin/personal/update", {
    access_token: localStorage.getItem('token'),
    id: params[0],
    realName: params[1],
    phone: params[2],
    email: params[3],
  });



//删除用户
export const deleteaccount = params =>
  http.post(url + "/api/v1/admin/account/delete", {
    access_token: params[0],
    id: params[1],
  });

//修改用户状态
export const updateaccount = params =>
  http.post(url + "/api/v1/admin/account/update", {
    access_token: params[0],
    id: params[1],
    status: params[2],
  });



//添加单位
export const addunit = params =>
  http.post(url + "/api/v1/unit/add", {
    access_token: localStorage.getItem('token'),
    unit: params[0],
    address: params[1],
    provinceId: params[2],
    cityId: params[3],
    districtId: params[4],
    userName: params[5],
    phone: params[6],
    longitude: params[7],
    latitude: params[8],
    unitType: params[9],
    id: params[10],
  });

//添加单位
export const deleteunit = params =>
  http.post(url + "/api/v1/unit/delete", {
    access_token: localStorage.getItem('token'),
    id: params[0],
  });


//新增摄像头
export const addcamera = params =>
  http.post(url + "/api/v1/device/add", {
    access_token: localStorage.getItem('token'),
    type: params[0],
    deviceId: params[1],
    unitId: params[2],
    location: params[3],
    id: params[4],
  });

//新增烟雾传感器
export const addsensor = params =>
  http.post(url + "/api/v1/device/add", {
    access_token: localStorage.getItem('token'),
    type: params[0],
    deviceId: params[1],
    imei: params[2],
    unitId: params[3],
    location: params[4],
    id: params[5],
  });


//删除设备
export const deletedevice = params =>
  http.post(url + "/api/v1/device/delete", {
    access_token: localStorage.getItem('token'),
    id: params[0],
  });

//获取萤石云未添加的设备列表
export const getNotHaveList = params =>
  http.get(url + "/api/v1/device/getNotHaveList", {
    access_token: localStorage.getItem('token'),

  });


//操作日志查询
export const getactivitylog = params =>
  http.get(url + "/api/v1/log/activity/get", {
    access_token: localStorage.getItem('token'),
    pageNum: params[0],
    pageSize: params[1],
    beginTime: params[2],
    endTime: params[3],
  });


//设备日志查询
export const getdevicelog = params =>
  http.get(url + "/api/v1/log/device/get", {
    access_token: localStorage.getItem('token'),
    pageNum: params[0],
    pageSize: params[1],
    deviceId: params[2],
    deviceType: params[3],
    dataType: params[4],
    beginTime: params[5],
    endTime: params[6],
  });



//查看报警视频
export const getAlarmVideoUrl = params =>
  http.get(url + "/api/v1/alarm/getAlarmVideoUrl", {
    access_token: localStorage.getItem('token'),
    deviceId: params[0],
    time: params[1],
  });


//获取当前用户
export const getpersonal = params =>
  http.get(url + "/api/v1/admin/personal/get", {
    access_token: localStorage.getItem('token'),
  });

//修改短信推送状态
export const changestaus = params =>
  http.post(url + "/api/v1/device/add", {
    access_token: localStorage.getItem('token'),
    id: params[0],
    sendMsg: params[1],
  });

//摄像头查看实时画面
export const getRealVideo = params =>
  http.get(url + "/api/v1/device/getRealVideo", {
    access_token: localStorage.getItem('token'),
    id: params[0],
  });

//统计基本信息
export const getBaseInfo = params =>
  http.get(url + "/api/v1/statistics/getBaseInfo", {
    access_token: localStorage.getItem('token'),

  });

//单位报警排行
export const getUnitAlarmList = params =>
  http.get(url + "/api/v1/statistics/getUnitAlarmList", {
    access_token: localStorage.getItem('token'),
    dateKey: params[0],
  });

//设备报警统计
export const getDeviceAlarmList = params =>
  http.get(url + "/api/v1/statistics/getDeviceAlarmList", {
    access_token: localStorage.getItem('token'),
    type: params[0],  // 1:周 2:月 3年
  });

//区域所属单位
export const getDistrictUnit = params =>
  http.get(url + "/api/v1/statistics/getDistrictUnit", {
    access_token: localStorage.getItem('token'),
  });

//获取所有菜单
export const getallmemu = params =>
  http.get(url + "/api/v1/admin/menu/get", {
    access_token: localStorage.getItem('token'),
  });

//激活摄像头设备
export const activeDevice = params =>
  http.post(url + "/api/v1/device/activeDevice", {
    access_token: localStorage.getItem('token'),
    code: params[0],
    id: params[1],
  });


//场景报警总量统计
export const getNearMonthUnitTypeAlarmList = params =>
  http.get(url + "/api/v1/statistics/getNearMonthUnitTypeAlarmList", {
    access_token: localStorage.getItem('token'),
    dateKey: params[0],
  });


//获取所有场景
export const getSceneList = params =>
  http.get(url + "/api/v1/statistics/getSceneList", {
    access_token: localStorage.getItem('token'),
  });


//获取所有场景
export const getSceneUnitAlarmList = params =>
  http.get(url + "/api/v1/statistics/getSceneUnitAlarmList", {
    access_token: localStorage.getItem('token'),
    unitType: params[0],
    dateKey: params[1],
  });

//获取所有场景
export const getUnitAlarmHeatImage = params =>
  http.get(url + "/api/v1/unit/getUnitAlarmHeatImage", {
    access_token: localStorage.getItem('token'),
    id: params[0],
  });


//获取对应单位报警数据
export const getUnitAlarm = params =>
  http.get(url + "/api/v1/statistics/getUnitAlarm", {
    access_token: localStorage.getItem('token'),
    dateKey: params[0],
    unitId: params[1],
  });


//单位告警折线图及热力图
export const getUnitAlarmAndHeat = params =>
  http.get(url + "/api/v1/statistics/getUnitAlarmAndHeat", {
    access_token: localStorage.getItem('token'),
    dateKey: params[0],
    unitId: params[1],
  });

//删除报警记录
export const deletealarm = params =>
  http.delete(url + "/api/v1/alarm", {
    access_token: localStorage.getItem('token'),
    eventId: params[0],
  });



