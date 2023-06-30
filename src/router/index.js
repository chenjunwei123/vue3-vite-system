import {createRouter, createWebHashHistory} from 'vue-router';
// 1. 定义路由组件， 注意，这里一定要使用 文件的全名（包含文件后缀名）
import Login from '@/components/Login.vue'
// const Login = () => import('@/components/Login.vue')
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import User from '@/components/user/User.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
import GoodsList from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'
import Orders from '@/components/Orders/orders.vue'
import Reports from '@/components/report/report.vue'
const routes = [
  {
    path: "/",
    redirect: '/login'
  },
  { path: "/login", component: Login },
  { path: "/home", component: Home,redirect:'/welcome',children: [
    {
      path: '/welcome', component: Welcome
    },
    {
      path: '/users', component: User
    },
    {
      path: '/rights', component: Rights
    },
    {
      path: '/roles', component: Roles
    },
    {
      path: '/categories', component: Cate
    },
    {
      path: '/params', component: Params
    },
    {
      path: '/goods', component: GoodsList
    },
    { path: '/goods/add', component: Add },
    { path: '/orders', component: Orders },
    { path: '/reports', component: Reports }
  ] },
]
const router = createRouter({
  // 指定路由的模式,此处使用的是hash模式
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})
router.beforeEach((to, _, next) => {
  // to表示将要访问的路径
  // from 表示从哪个路径跳转而来
  // next是一个函数表示放行
  // next()  next('/login')强制跳转
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  // 可以校验token合法性,这里只查询token是否存在
  if (!tokenstr) return next('/login')
  next()
})
// Vue-router新版本中，需要使用createRouter来创建路由
export default router
