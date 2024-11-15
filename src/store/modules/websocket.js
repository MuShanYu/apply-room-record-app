import indexConfig from '@/config/index.config.js'
import { getToken } from '@/utils/auth.js'

const MAX_RECONNECT_ATTEMPTS = 5; // 最大重连次数
const socketData = {
  state: {
    socketTask: null, //socket实例

    websocketData: {}, // 存放从后端接收到的websocket数据

    webSocketPingTimer: null, // 心跳定时器

    webSocketPingTime: 5000, // 心跳的间隔，当前为 10秒,

    webSocketReconnectCount: 1, // 重连次数

    webSocketIsReconnect: true, // 是否重连

    webSocketIsOpen: true, //链接是否在打开
  },
  mutations: {
    setSockTask(state, data) {
      state.socketTask = data;
    },

    setWebsocketData(state, data) {
      state.websocketData = data;
    },

    setReconnectCount(state, count) {
      state.webSocketReconnectCount = count;
    },

    setIsOpen(state, data) {
      state.webSocketIsOpen = data;
    },
  },

  actions: {
    websocketInit({ state, dispatch, commit }) {
      let socketTask = uni.connectSocket({
        // url, // url是websocket连接ip
        url: `${indexConfig.socketUrl}?token=${getToken()}&platform=wx`,
        // 我只关心我的socket连接成功还是失败，你给我socketTask对象我自己调用其中的方法进行处理即可，不用关心uni接口调用成功还是失败。
        complete: ()=> {} // 回调函数
      });
      //检测链接打开
      socketTask.onOpen(() => dispatch("websocketOnOpen"));
      //接收服务器消息
      socketTask.onMessage((res) => dispatch("websocketOnMessage", res));
      // 链接关闭事件
      socketTask.onClose((e) => dispatch("websocketOnClose"));
      //链接错误
      socketTask.onError((e) => dispatch("websocketOnError"));
      commit("setSockTask", socketTask);
    },
    // 连接打开时
    websocketOnOpen({ dispatch, commit }) {
      console.log("WebSocket连接正常打开！");
      commit("setIsOpen", true);
      commit("setReconnectCount", 1); // 重置重连计数
      // 发送在线设备信息
      uni.getSystemInfo({
        success: (e) => {
          const device = e.deviceBrand + '(' + e.deviceType + ')';
          // console.log('发送设备信息中');
          dispatch('websocketSend', device)
        }
      })
      //开始心跳检测
      dispatch("webSocketPing");
    },
    // 发送数据
    websocketSend({ state, dispatch }, data) {
      state.socketTask.send({
        data,
        fail: (e) => {
          console.log("uni send接口调用失败", e);
          dispatch("webSocketClose");
        },
      });
    },
    // 收到数据
    websocketOnMessage({ commit }, res) {
      // 修改状态为未连接
      //接到推送的消息--显示全局弹窗
      // console.log("收到服务器内容：" + res.data);
      // 存储消息
      //commit("setWebsocketData", res.data);
    },
    websocketOnClose({ state, commit, dispatch }) {
      //服务端连接关闭，或者遇到error时触发
      commit("setIsOpen", false);
      clearTimeout(state.webSocketPingTimer); // 清理心跳定时器
      state.socketTask = null;
      console.log("websocketOnClose连接关闭");
    },
    // socket连接异常
    websocketOnError({ commit, dispatch }) {
      //链接关闭执行
      console.log("websocketOnError连接错误");
      dispatch("webSocketClose");
    },
    // 定时心跳告诉服务器自己还活着，防止丢包
    webSocketPing({ state, dispatch }) {
      if (getToken() && state.webSocketIsOpen) {
        state.webSocketPingTimer = setTimeout(() => {
          // console.log("发送心跳，ping");
          dispatch("websocketSend", "ping");
          clearTimeout(state.webSocketPingTimer); // 清理当前心跳定时器
          dispatch("webSocketPing"); // 重新开始心跳
        }, state.webSocketPingTime);
      }
    },
    // 连接断开做的处理
    webSocketClose({ state, dispatch, commit }) {
      if (getToken()) {
        commit("setIsOpen", false);
        clearTimeout(state.webSocketPingTimer); // 清理心跳定时器
        state.socketTask = null;
        if (state.webSocketIsReconnect && state.webSocketReconnectCount <= MAX_RECONNECT_ATTEMPTS) {
          dispatch("webSocketReconnect");
        }
      }
    },
    // WebSocket 重连
    webSocketReconnect({ state, dispatch, commit }) {
      if (getToken() && !state.webSocketIsOpen && state.webSocketReconnectCount <= MAX_RECONNECT_ATTEMPTS) {
        console.log(`第 ${state.webSocketReconnectCount} 次重连`);
        commit("setReconnectCount", state.webSocketReconnectCount + 1);
        dispatch("websocketInit"); // 尝试重连
        // 5秒后检查是否重连成功，否则继续尝试
        setTimeout(() => {
          if (!state.webSocketIsOpen && state.webSocketReconnectCount <= MAX_RECONNECT_ATTEMPTS) {
            dispatch("webSocketReconnect");
          }
        }, 5000);
      }
    },
    //手动关闭websocket
    websocketCloseGuanBi({ state }) {
      if (!state.socketTask) return;
      state.socketTask.close({
        complete: () => {}
      });
    },
  },
};

export default socketData;
