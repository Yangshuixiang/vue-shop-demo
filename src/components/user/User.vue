<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片式图-->
    <el-card>
      <!--搜索输入框区域-->
      <!--element提供Row 组件，el-row-->
      <el-row :gutter="20">
        <el-col :span="10">
          <!--clearable可清空,element-->
          <!--clear清空再查询-->
          <el-input placeholder="请输入内容" v-model="queryUserInfo.query" clearable @clear=getUserList
                    @change="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">

          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>

        </el-col>
      </el-row>

      <!--表格区-->
      <!--border边框线/stripe变色,element-->
      <el-table :data="userList" border stripe>
        <!--索引type-->
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!--<el-table-column label="状态" prop="mg_state">-->
        <el-table-column label="状态">
          <!--定义作用域插槽,slot-scope接收数据,scope固定-->
          <template slot-scope="scope">
            <!--switch,element开关-->
            <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!--按钮-->
          <!--slot-scope="scope"拿到此行数据的信息-->
          <template slot-scope="scope">
            <!--修改-->
            <!--enterable鼠标是否可进入到 tooltip 中,element-->
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <el-button @click="showEditUserForm(scope.row.id)" type="primary" icon="el-icon-edit"
                         size="mini"></el-button>
            </el-tooltip>
            <!--分配权限-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
            <!--删除-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!--分页-->
      <!--layout指定页面分页显示结构,有什么显示什么-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryUserInfo.pagenum"
          :page-sizes="[1, 2, 10, 20]"
          :page-size="queryUserInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalUsers">
      </el-pagination>

      <!--添加用户的弹框-->
      <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClose">
        <!--内容主题区域-->
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户对话框-->
      <el-dialog
          title="修改用户"
          :visible.sync="editUserdialogVisible"
          width="50%"
          @close="editDialogClose">

        <el-form :model="editUserForm" :rules="editUserFromRules" ref="editUserFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>


    </el-card>


  </div>

</template>

<script>
export default {

  data() {
    //校验邮箱规则
    var checkEmailRule = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        callback()
      } else {
        callback(new Error("邮箱格式不正确!"))
      }
    }

    //校验手机号规则
    var checkMobileRule = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        callback()
      } else {
        callback(new Error("手机号格式不正确!"))
      }
    }

    return {
      //获取用户列表的的参数对象
      queryUserInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 2
      },
      //定义一个用户列表
      userList: [],
      totalUsers: 0,
      //表格用户数据对象
      tableData: [{}],
      //控制添加用户弹窗的隐藏和显示
      addDialogVisible: false,
      //添加用户的表格对象
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户的表格对象校验规则
      addUserFormRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {validator: checkEmailRule, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机号', trigger: 'blur'},
          {validator: checkMobileRule, trigger: 'blur'}
        ],
      },
      //控制修改用户对话框
      editUserdialogVisible: false,
      //查询用户信息,弹框
      editUserForm: {},
      //修改用户信息的表达校验规则
      editUserFromRules: {
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {validator: checkEmailRule, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机号', trigger: 'blur'},
          {validator: checkMobileRule, trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    //打开页面即调用获取用户列表的接口
    this.getUserList();

  },
  methods: {
    async getUserList() {

      const {data: res} = await this.$http.get("users", {params: this.queryUserInfo});
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败!")
      // console.log(res)
      this.userList = res.data.users
      this.totalUsers = res.data.total
    },
    //监听pagesize改变事件
    // eslint-disable-next-line no-unused-vars
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryUserInfo.pagesize = newSize
      this.getUserList()

    },
    //页码改变事件
    // eslint-disable-next-line no-unused-vars
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryUserInfo.pagenum = newPage
      this.getUserList()
    },
    //用户开关状态的改变
    async userStateChange(userInfo) {
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error("修改用户状态失败!")
      }
      this.$message.success("更新用户状态成功!")
    },
    //关闭弹框情况
    addDialogClose() {
      //调用ref的函数清空
      this.$refs.addUserFormRef.resetFields();
    },
    //点击确认,添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        //表单预校验通过则发起请求
        const {data: res} = await this.$http.post("users", this.addUserForm)
        if (res.meta.status !== 200) this.$message.error("添加用户失败!")
        this.$message.success("添加用户成功!")
        //隐藏弹框
        this.addDialogVisible = false
        //刷新列表
        this.getUserList()
      })
    },
    //点开修改用户弹框,查询用户数据
    async showEditUserForm(userId) {
      //发起请求
      const {data: res} = await this.$http.get("users/" + userId);
      if (res.meta.status !== 200) return this.$message.error("查询用户信息失败!")
      this.editUserForm = res.data
      //要不要直接用el提供的弹框函数,取决于弹框的同时要不要干点其他的事情
      //打开弹窗
      this.editUserdialogVisible = true;

    },
    //修改用户弹框的重置
    editDialogClose(){
        this.$refs.editUserFormRef.resetFields();
    }

  }


}
</script>

<style lang="less" scoped>

</style>