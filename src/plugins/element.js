import Vue from "vue"
import { Button} from "element-ui";
import  {Form,FormItem} from "element-ui";
import {Input} from "element-ui";
//导入弹框提示组件
import {Message} from "element-ui";

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
//全局挂载到Vue上
//$message自定义,每一个组件可以通过this访问
Vue.prototype.$message = Message;