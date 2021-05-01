import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$store = store //挂载全局

App.mpType = 'app'
// 公共js
import PubFuc from "./common/js/util.js"
Vue.prototype.$pubFuc = PubFuc

//挂载
Vue.prototype.$websiteUrl = "http://localhost:3000";
Vue.prototype.$imgSuffix = "?imageView&thumbnail=369x0&quality=75&tostatic=0"

const app = new Vue({
  ...App
})
app.$mount()
