import Vue from "vue"
// import { Button} from "element-ui";
// import  {Form,FormItem} from "element-ui";
// import {Input} from "element-ui";
//导入弹框提示组件
import {Message,
    Button,
    Form,
    FormItem,
    Input,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    } from "element-ui";

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
//全局挂载到Vue上
//$message自定义,每一个组件可以通过this访问
Vue.prototype.$message = Message;