import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import packages from './package'
import packages_stu from './package_stu'

import mixin from './mixin'
import request from './http'
import getStaticFile from '@/http/static'

import '@/assets/style/icon-font/iconfont.css'
import '@/assets/style/common.css'
import '@/assets/style/ots-eui.css'
// import './assets/style/changeColor.less'
Vue.config.productionTip = false
Vue.prototype.$event = new Vue()
Vue.prototype.$api = request
Vue.prototype.$getStaticFile = getStaticFile
Vue.use(ElementUI)
Vue.use(packages)
Vue.use(packages_stu)
Vue.mixin(mixin)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
