<template>

  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" height="50px">
        <span>电商管理后台系统</span>

      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主题区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--折叠按钮-->
        <div class="toggle-button" @click="toggleCollapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
        <!--菜单区-->
        <!--active-text-color选中菜单的颜色-->
        <!--unique-opened是element菜单的属性,默认true,每次只打开一个子菜单-->
        <!--collapse-transition除去动画效果,拖延-->
        <!--router是element表单提供的跳转功能-->
        <el-menu
            background-color="#2b4b6b"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true">
          <!--一级菜单-->
          <!--:index,:key动态数据绑定-->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i :class="iconObj[item.id ]"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边-->
      <el-main>

        <router-view></router-view>

      </el-main>


    </el-container>
  </el-container>


</template>

<script>
export default {

  data() {

    return {

      //左侧菜单数据
      menuList: [],
      iconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-lock",
        101: "el-icon-shopping-bag-1",
        102: "el-icon-s-order",
        145: "el-icon-data-line"

      },
      isCollapse: false,

    }


  },

  //生命周期函数
  created() {
    this.getMenuList()

  },

  methods: {
    //登出
    logout: function () {
      //清空session
      window.sessionStorage.clear();
      this.$router.push("/login");

    },
    //获取菜单
    async getMenuList() {
      const {data: res} = await this.$http.get("menus");
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data

    },
    //折叠效果
    toggleCollapse() {

      this.isCollapse = !this.isCollapse;

    }

  }

}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #2b4b6b;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #2b4b6b;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eeeeee;
}

.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #2b4b6b;
  font-size: 26px;
  line-height: 24px;
  color: white;
  text-align: right;
  cursor: pointer;


}

</style>