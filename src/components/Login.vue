<template>
  <div class="login_container">

    <div class="login_box">
      <!--logo区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--文本框区-->
      <!--rules定义表单校验规则-->
      <!--ref获取整个表单对象-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0px" class="login_form">
        <!--用户名-->
        <!--prop指定表单具体校验规则-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid">

          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <!--type="password"隐藏密码-->
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock">
          </el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">

          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFormFields">重置</el-button>

        </el-form-item>


      </el-form>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: ""

      },
      //表单校验规则
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
      }

    }

  },

  methods: {
    //重置,清空表单数据
    resetLoginFormFields: function () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields();

    },

    login: function () {
      //表单预校验
      this.$refs.loginFormRef.validate(
          //回调函数
          async valid => {
            // console.log(valid)
            if (!valid) return;
            //方法返回值是promise,可以通过使用await修饰简化,await必须由async异步操作
            //data重命名为res,简化返回数据
            const {data: res} = await this.$http.post("login", this.loginForm);
            // const result = await this.$http.post("login",this.loginForm);
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error("登录失败!")
            this.$message.success("登录成功!");
            //登录成功,存储服务器返回的token到sessionStorage
            //跳转到主页
            //window前面不能有return,会报错无法记载到
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home")

          })

    }
  }


}

</script>

<!--scoped防止组件之间的样式冲突-->
<style lang="less" scoped>
.login_form {

  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;


}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 450px;
  background-color: #ffffff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #dddddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }

}

</style>
