<template>
<div class="login_container">
<div class="login_box">
  <!-- 头像区域 -->
  <div class="avatar_box">
    <img src="../assets/logo.png" alt="">
  </div>
  <!-- 表单区域 -->
  <el-form ref="loginFormRef" label-width="80px" class="login_form" :model="loginForm" :rules="LoginRules">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="loginForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="loginForm.password" type="password"></el-input>
    <!-- <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-suo"></el-input> -->
  </el-form-item>
  <el-form-item class="btns">
    <el-button type="primary" @click="startLogin">登陆</el-button>
    <el-button type="info" @click="resetLoginForm">重置</el-button>
  </el-form-item>
  </el-form>
</div>
</div>
</template>

<script>
import { reactive,ref,getCurrentInstance} from 'vue'
export default {
  setup () {
    const {proxy} = getCurrentInstance()
    // 表单数据
    const loginForm = reactive({
        username: 'admin',
        password: ''
      })
      // 表单验证规则
    const LoginRules = reactive({
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      })
      // 点击重置按钮，重置表单数据为初始值
      const loginFormRef = ref(null)
      const resetLoginForm = () => loginFormRef.value.resetFields()
      // 点击登陆按钮，验证表单规则，消息提示，token身份保存sessionstorage,跳转/home
      const startLogin = ()=>{
      loginFormRef.value.validate(async(isValid) => {
        if (!isValid) return false
        const res = await proxy.$http.post('login', loginForm)
        const loginFlag = proxy.$msg(res)
        if(loginFlag === true) {
        window.sessionStorage.setItem('token', res.data.token)
          proxy.$router.push({ path: '/home' })
       }
      })
    }
    return {
      loginForm,
      LoginRules,
      resetLoginForm,
      startLogin,
      loginFormRef
    }
  },
}
</script>

<style scoped lang='less'>
.login_container {
  height: 100%;
  background-color: red;
  .login_box {
    height: 300px;
    width: 450px;
    border-radius: 5px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
      height: 120px;
      width: 120px;
      border-radius: 60px;
      background-color: #fff;
      border: 1px solid #fff;
      padding: 5px;
      overflow: hidden;
      position: absolute;
      left: 50%;
      // top: 50%;
      transform: translate(-50%,-50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 85%;
      padding: 10px 20px;
    }
  }
}
</style>