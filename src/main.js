import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import "./assets/css/global.css"
import "./plugins/element"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.prototype.$http = axios;
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
//拦截所有的request并且在请求头中附上token
axios.interceptors.request.use(config=>{
  //给config赋值
  //Authorization添加请求头
  config.headers.Authorization = window.sessionStorage.getItem("token");

  //retrun固定写法
  return config;
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
