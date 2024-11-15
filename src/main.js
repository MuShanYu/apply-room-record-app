import App from './App'

// #ifndef VUE3
import Vue from 'vue'

Vue.config.productionTip = false
App.mpType = 'app'

import store from './store'
// 引入全局TuniaoUI
import TuniaoUI from './tuniao-ui'
Vue.use(TuniaoUI)
// 引入TuniaoUI提供的vuex简写方法
import vuexStore from '@/store/$tn.mixin.js'
Vue.mixin(vuexStore)
// 引入页面公告的代码
import globalPageCode from '@/mixin/global_page_mixin.js'
Vue.mixin(globalPageCode)

import wLoading from "@/components/w-loading.vue";
Vue.component('w-loading', wLoading)

import {
	router,
	RouterMount
} from '@/router/index.js' //路径换成自己的
Vue.use(router)


const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif