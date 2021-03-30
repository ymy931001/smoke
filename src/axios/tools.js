import axios from "axios";
import qs from "qs";
import { message } from "antd";


axios.interceptors.request.use(
  config => {
    // 发送请求之前做什么
    //如果有token给所有的headers加入token参数
    if (config.method === "post") {
      if (localStorage.getItem("token") && localStorage.getItem("userID")) {
        config.headers.authorization = `Bearer ${localStorage.getItem(
          "token"
        )}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



axios.interceptors.response.use(
  response => {
    console.log(response)
    if (response.data.status === 500) {
      message.error("网络异常")
    }
    // axios.defaults.withCredentials=true;
    return response;
  },
  error => {
    return Promise.reject(error.response);
  }
);


function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  //  else {
  //   window.location.href = "/"
  // }

  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}


function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {

    return;
  }
  //如果接口统一规范好成功失败的返回情况，则可以使用这个方法进行封装
  // if (res.data && (!res.data.success)) {
  //   message(res.data.status)
  // }
  return res;
}

export default {
  post(url, data, adata) {
    return axios({
      method: "post",
      url,
      data: qs.stringify(data),
      // responseType: 'blob',
      timeout: 50000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    }).then(response => {
      return checkStatus(response);
    })
  },
  get(url, params) {
    // const user = JSON.parse(localStorage.getItem('user')).token;
    return axios({
      method: 'get',
      url,
      // params: { 'Authorization': user, ...params }, // get 请求时带的参数
      params: { ...params }, // get 请求时带的参数
      timeout: 50000,
      // responseType: 'blob',
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },

  delete(url, params) {
    // const user = JSON.parse(localStorage.getItem('user')).token;
    return axios({
      method: 'DELETE',
      url,
      // params: { 'Authorization': user, ...params }, // get 请求时带的参数
      params: { ...params }, // get 请求时带的参数
      timeout: 10000,
      // responseType: 'blob',
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
};


