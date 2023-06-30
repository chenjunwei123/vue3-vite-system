<template>
  <el-container>
    <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="../assets/logo.png" alt="">
      <span>后台管理系统</span>
    </div>
    <el-button @click="logOut">退出</el-button>
  </el-header>
  <!-- 页面主体区域 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle_button" @click="toggleCollapse" >|||</div>
      <el-menu
      :default-active="activePath"
      router
      :collapse-transition="false"
      mode="vertical"
      :collapse="isCollapse"
      background-color="#4ed8eb"
      text-color="red"
      active-text-color="#ffd04b"
      unique-opened>
      <!-- 一级菜单 -->
      <el-sub-menu :index="String(item.id)" v-for="item in menuList" :key="item.id">
        <!-- 一级菜单模板区域 -->
        <template #title>
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveNavState('/'+item1.path)">
           <template #title>
          <i class="el-icon-menu"></i>
          <span>{{item1.authName}}</span>
        </template>
        </el-menu-item>
        </el-sub-menu>
    </el-menu>
    </el-aside>
    <!-- 右侧 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import { reactive ,getCurrentInstance, toRefs, } from 'vue'
export default {
  setup () {
    const {proxy} = getCurrentInstance()
    let state = reactive({
      menuList:[],
      // 菜单栏icon,以每个1级菜单的id为属性名
      iconObj:{
        125: 'iconfont icon-morentouxiang',
        103: 'iconfont icon-volumemeasurement',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-mianxingdanju',
        145: 'iconfont icon-_baobiao'
      },
      // 菜单栏折叠属性
      isCollapse:false,
      // 激活菜单栏路径
      activePath:'',
      // 推迟登陆功能，并返回登录界面
      logOut:() => {
      window.sessionStorage.clear()
      proxy.$router.push('/login')
    },
    // 定义发起网络请求，得到左侧菜单栏数据的方法
    getMenuList:async () => {
      const res = await proxy.$http.get('menus')
      proxy.$msg(res)
      state.menuList =res.data
      // console.log(state.menuList);
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse: () => {
      state.isCollapse = !state.isCollapse
    },
    // 点击二级菜单使其保持高亮状态
    saveNavState: (activePath) => {
      window.sessionStorage.setItem('activePath', activePath)
      activePath = window.sessionStorage.getItem('activePath')
     },
  })
    state.getMenuList()
    return {
      ...toRefs(state)
    }
}
}
</script>

<style scoped lang='less'>
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgb(103, 243, 189);
  img {
    background-color: rgb(103, 243, 189);
    height: 100%;
    margin-right: 10px;
  }
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: black;
  font-size: 20px;
  font-weight: 600;
  div {
    height: 80%;
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: rgb(78, 216, 235);
  .toggle_button {
    background-color: rgb(78, 216, 235);
    color: red;
    font-size: 18px;
    display: flex;
    justify-content: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eee;
}
.iconfont {
  margin-right: 10px;
}
span {
  font-size: 18px;
}
.el-menu {
  border-right: 0px;
}
</style>