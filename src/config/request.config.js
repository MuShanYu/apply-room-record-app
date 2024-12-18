/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import indexConfig from "@/config/index.config.js";
import store from "@/store/index.js";

const writeList = [
  "/config/get/by/",
  "/user/login",
  "/user/logout",
  "/user/get/verifyCode",
  "/user/update/pwd",
  "/user/refresh/token",
  "/user/register",
  "/user/wx/login/",
];
export default {
  config: {
    baseUrl: indexConfig.baseUrl,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {},
    method: "GET",
    dataType: "json",
    /* 如设为json，会对返回的数据做一次 JSON.parse */
    responseType: "text",
    success() {},
    fail() {},
    complete() {},
  },
  interceptor: {
    request: null,
    response: null,
  },
  request(options) {
    if (!options) {
      options = {};
    }
    const uri = options.url;
    options.baseUrl = options.baseUrl || this.config.baseUrl;
    options.dataType = options.dataType || this.config.dataType;
    options.url = options.baseUrl + options.url;
    options.data = options.data || {};
    options.method = options.method || this.config.method;
    const token = uni.getStorageSync("token");
    // token处理
    if (token) {
      // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
      let _token = {
        token: token,
      };
      options.header = Object.assign({}, options.header, _token);
    }
    return new Promise((resolve, reject) => {
      // 如果这里不符合发起请求的条件，直接reject
      // 当前请求路径不已writeList开头
      if (!writeList.some((item) => uri.startsWith(item))) {
        // 判断是否有登录状态，登录是否过期
        const userInfo = uni.getStorageSync("userInfo");
        const loginExpiredTime = uni.getStorageSync("loginExpiredTime");
        if (!userInfo || !token) {
          handleServiceError(-1);
          reject();
          return;
        }
        if (loginExpiredTime < new Date().getTime()) {
          // 登录过期，重新登录
          handleServiceError(-3);
          reject();
          return;
        }
      }
      // ---判断结束---
      let _config = null;

      options.complete = (response) => {
        let statusCode = response.statusCode;
        response.config = _config;
        if (this.interceptor.response) {
          let newResponse = this.interceptor.response(response);
          if (newResponse) {
            response = newResponse;
          }
        }
        // 统一的响应日志记录
        // _reslog(response)
        // 返回结果
        if (statusCode === 200) {
          //成功
          // 处理响应结果
          if (response.data) {
            let serviceCode = response.data.code;
            if (serviceCode !== 200) {
              handleServiceError(serviceCode, response.data.message);
              reject(response.data);
            } else {
              resolve(response.data.queryData);
            }
          }
        } else {
          reject(response);
        }
      };

      _config = Object.assign({}, this.config, options);
      _config.requestId = new Date().getTime();

      if (this.interceptor.request) {
        this.interceptor.request(_config);
      }

      // 统一的请求日志记录
      // _reqlog(_config);
      // request请求初始化完成，发起请求
      // 几种情况不发起请求
      uni.request(_config);
    });
  },
  get(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "GET";
    options.header = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    return this.request(options);
  },
  post(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "POST";
    options.header = {
      "Content-Type": "application/json;charset=UTF-8",
    };
    return this.request(options);
  },
  put(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "PUT";
    if (!options.header) {
      options.header = {
        "Content-Type": "application/json;charset=UTF-8",
      };
    }
    return this.request(options);
  },
  delete(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "DELETE";
    return this.request(options);
  },
};

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
  if (process.env.NODE_ENV === "development") {
    console.log("【" + req.requestId + "】 地址：" + req.url);
    if (req.data) {
      console.log(
        "【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data)
      );
    }
  }
  //TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
  let _statusCode = res.statusCode;
  if (process.env.NODE_ENV === "development") {
    console.log(
      "【" + new Date().toTimeString() + "】 结果：" + JSON.stringify(res.data)
    );
  }
}
// 这里的目的是会话过期（token过期），续期会话即可
function handleRefreshToken() {
  // 判断是否有其他请求正在执行
  const isOnRefreshToken = uni.getStorageSync("isOnRefreshToken");
  if (isOnRefreshToken) {
    return true;
  }
  // 没有从请求中读取到有效token
  const userInfo = uni.getStorageSync("userInfo");
  // 如果userInfo存在，那么直接续期token即可，刷新token也相当于进行了一次登录信息刷新
  if (userInfo) {
    // 正在刷新，记录一个状态，避免多次请求
    uni.setStorageSync("isOnRefreshToken", true);
    uni.showLoading();
    uni.request({
      url: indexConfig.baseUrl + "/user/refresh/token",
      data: {
        userId: userInfo.id,
        device: "wechat",
      },
      success(res) {
        let newToken = res.data.queryData.token;
        let newUserInfo = res.data.queryData.userInfo;
        let permissions = res.data.queryData.permissions;
        let roles = res.data.queryData.roles;
        // 如果socket断开则重新连接
        if (!store.state.websocket.webSocketIsOpen) {
          store.dispatch("websocketInit")
        }
        uni.setStorageSync("userInfo", newUserInfo); //更新用户信息
        // 更新登录有效时间
        uni.setStorageSync(
          "loginExpiredTime",
          new Date().getTime() + indexConfig.loginExpiredTime
        );
        uni.setStorageSync("roles", roles);
        uni.setStorageSync("permissions", permissions);
        store.dispatch("refreshToken", newToken).then(() => {
          uni.hideLoading();
          uni.showToast({
            title: "已为您续期会话，3s后刷新",
            icon: "none",
            duration: 3000,
          });
          setTimeout(() => {
            // 获取当前页面
            // 获取当前页面的实例对象
            const currentPage = getCurrentPages()[getCurrentPages().length - 1];
            // 获取当前页面的路径
            console.log('页面数据', currentPage);
            console.log("decode", decodeURIComponent(decodeURIComponent(currentPage.$page.fullPath)))
            // relaunch当前界面，相当于刷新
            uni.redirectTo({
              url: decodeURIComponent(decodeURIComponent(currentPage.$page.fullPath)),
            });
          }, 3000);
        });
      },
      fail(e) {
        uni.hideLoading();
        console.log(e);
      },
      complete() {
        // 无论成功与否都要删除这个状态，防止影响其他异常返回结果处理
        uni.removeStorageSync("isOnRefreshToken");
      },
    });
    return true;
  }
  return false;
}

function handleServiceError(code, message = "") {
	// 防止发生异常请求，websocket还保持连接
  if (store.state.websocket.webSocketIsOpen)
    store.dispatch("websocketCloseGuanBi");
  if (code === -2 || code === -4 || code === -5) {
    store.dispatch("clear").then(() => {
      // 跳转在路由钩子中统一控制
      uni.showToast({
        title: "登录状态异常，请重新登录",
        icon: "none",
        duration: 2000,
      });
    });
  } else if (code === -1) {
    store.dispatch("clear").then(() => {
      // 跳转在路由钩子中统一控制
      uni.showToast({
        title: "请您在登录后使用",
        icon: "none",
        duration: 2000,
      });
    });
  } else if (code === -3) {
    // 登录状态过期，提示并刷新登录
    handleRefreshToken();
  } else if (code === 500) {
    uni.showModal({
      title: "提示",
      content: "服务器错误，系统异常，请稍后重试",
      showCancel: false,
      confirmText: "Error",
      success(res) {
        if (res.confirm) {
          // 重定向到登录页面
          uni.showToast({
            title: "系统错误",
            icon: "none",
          });
        }
      },
    });
  }
}
