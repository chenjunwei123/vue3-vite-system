<template>
<div class="users_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <div style="margin-top: 5px;">
    <!-- 搜索与添加区域 -->
    <el-row :gutter="40">
      <el-col :span="8">
         <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
           <el-button slot="append" :icon="Search" @click="getUserList"></el-button>
         </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addUsersDialogVisiable = true">添加用户</el-button>
      </el-col>
    </el-row>
  </div>
  <!-- //用户数据表格区域 -->
<el-table
      border
      stripe
      :data="userList"
      style="width: 100%">
      <el-table-column
        label="#"
        align="center"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <!-- scope.row代表这一行的数据 -->
        <template v-slot='scope'>
          <el-switch
            @change="userStateChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="250">
        <template v-slot='scope'>
          <!-- {{scope.row}} -->
          <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
            <el-button type="primary"  round size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
            <el-button type="danger"  round size="mini" @click="delUserById(scope.row.id)">删除</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning"  round size="mini" @click="setRole(scope.row)">分配</el-button>

          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1,3,5,9]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 添加用户对话框区域 -->
<el-dialog
@close="handleCloseAddUserDialog"
  title="添加用户"
  v-model="addUsersDialogVisiable"
  width="50%">
  <el-form :model="addUsersForm" :rules="addUsersRules" ref="addUsersFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addUsersForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addUsersForm.password" type="password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addUsersForm.email" type="email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addUsersForm.mobile" type="tel"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
    <el-button @click="addUsersDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
  </template>
</el-dialog>
<!-- 编辑用户对话框 -->
<el-dialog
@close="handleEditUserDialogClose"
  title="编辑用户"
  v-model="editUserDialogVisiable"
  width="50%">
 <el-form :model="editUserForm" :rules="addUsersRules" ref="editUsersFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editUserForm.username" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editUserForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editUserForm.mobile"></el-input>
  </el-form-item>
 </el-form>
  <template #footer>
    <span class="dialog-footer">
    <el-button @click="editUserDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
  </template>
</el-dialog>
<!-- 分配角色对话框 -->
<el-dialog
@close="setRoleDialogClose"
  title="分配角色"
  v-model="setRoleDialogVisible"
  width="50%">
  <p><label>当前用户: </label><span>{{setRoleUserInfo.username}}</span></p>
  <p>
    <label>当前角色: </label><span>{{setRoleUserInfo.role_name}}</span>
  </p>
  <div>
    <label>分配新角色: </label>
    <el-select v-model="selectRoleId" placeholder="请选择">
    <el-option
      v-for="(item,index) in rolesList"
      :key="index"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
  <template #footer>
    <span class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleById">确 定</el-button>
  </span>
  </template>
</el-dialog>
</div>
</template>

<script>
import { reactive, toRefs,getCurrentInstance,ref} from 'vue'
// import { FormInstance } from 'element-plus'
export default {
  setup () {
    const addUsersFromRef = ref()
    const editUsersFromRef = ref()
    const {proxy} = getCurrentInstance()
    // 验证邮箱的规则
   const checkEmail = (_, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法的邮箱'))
    }
      // 验证手机的规则
      const checkMobile = (_, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法的手机号'))
    }
    const state = reactive({
      // 用于发起网络请求获取用户列表所需的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 所取得的用户数据数组
      userList: [],
      // 总页数
      total: 0,
      // 添加用户对话框可视化
      addUsersDialogVisiable: false,
      // 添加用户对象
      addUsersForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户规则
      addUsersRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户对话框可视化
      editUserDialogVisiable: false,
      // 编辑用户信息对象
      editUserForm: {
        id: '',
        mobile: '',
        username: '',
        email: ''
      },
      // 分配角色对话框可视化
      setRoleDialogVisible: false,
      // 设置分配角色的用户信息
      setRoleUserInfo: {
        username: '',
        role_name: '',
        id: ''
      },
      // 角色列表数据
      rolesList: [],
      // 已选中的角色ID
      selectRoleId: '',
       // 获取用户数据列表方法
      getUserList:async()=>{
      const res = await proxy.$http.get('users',state.queryInfo)
      proxy.$msg(res)

      state.userList = res.data.users
      state.total = res.data.total
     },
    // 监听pagesize改变的事件
    handleSizeChange :(newSize)=> {
      state.queryInfo.pagesize = newSize
      state.getUserList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange :(newPage) =>{
      state.queryInfo.pagenum = newPage
      state.getUserList()
    },
    // 用户状态改变方法
      userStateChange:async(userInfo) =>{
      const res = await proxy.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return proxy.$msg(res)
      }
      proxy.$msg(res)
    },
    // 监听添加用户对话框的关闭
    handleCloseAddUserDialog:()=>{
      addUsersFromRef.value.resetFields()
    },
    // 添加用户对话框点击确定,发起网络请求保存至后台，关闭对话框，重新更新用户数据列表
    addUser: ()=>{
      addUsersFromRef.value.validate(async (isValid) => {
        if (!isValid) return false
        const res = await proxy.$http.post('users', state.addUsersForm)
        proxy.$msg(res)
        state.addUsersDialogVisiable = false
        state.getUserList()
      })

    },
    // 打开编辑用户对话框
    showEditDialog: (userInfo)=>{
      state.editUserDialogVisiable = true
      const { id, email, mobile, username } = userInfo
      state.editUserForm = {
        id,
        email,
        mobile,
        username
      }
    },
    // 监听编辑用户对话框关闭
    handleEditUserDialogClose: ()=>{
      editUsersFromRef.value.resetFields()
    },
    // 点击编辑用户对话框确定按钮
    editUser: ()=>{
      editUsersFromRef.value.validate(async (isValid) => {
        if (!isValid) return false
        const { email, mobile, id } = state.editUserForm
        const res = await proxy.$http.put(`users/${id}`, { email, mobile })
        proxy.$msg(res)
        state.editUserDialogVisiable = false
        state.getUserList()
      })
    },
    // 删除用户
    delUserById: async(id)=>{
        const res = await proxy.$http.delete(`users/${id}`)
        proxy.$msg(res)
        state.getUserList()
    },
    // 分配角色
     setRole: async (userInfo)=>{
      //
      state.setRoleDialogVisible = true
      const res = await proxy.$http.get('roles')
      proxy.$msg(res)
      state.rolesList = res.data
      state.setRoleUserInfo = {
        username: userInfo.username,
        role_name: userInfo.username,
        id: userInfo.id
      }
      //
    },
    // 分配角色对话框，确定按钮点击事件
     setRoleById: async ()=>{
      if (!state.selectRoleId) {
        return false
      }
      const res = await proxy.$http.put(`users/${state.setRoleUserInfo.id}/role`, { rid: state.selectRoleId })
      proxy.$msg(res)
      state.setRoleDialogVisible = false
      state.getUserList()
    },
    // 监听分配角色对话框关闭
    setRoleDialogClose: ()=>{
      state.selectRoleId = ''
    }
    })
    state.getUserList()
    return {
      ...toRefs(state),
      addUsersFromRef,
      editUsersFromRef
    }
  },
}
</script>

<style scoped lang='less'>
</style>
