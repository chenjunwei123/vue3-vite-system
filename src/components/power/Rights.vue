<template>
<div class="rights_container">
   <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-table :data="rightList" border stripe>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
      <el-table-column label="路径" prop="path" align="center"></el-table-column>
      <el-table-column label="权限等级" prop="level" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.level == 0">一级</el-tag>
          <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
  import {reactive,getCurrentInstance,toRefs} from 'vue'
export default {
  setup () {
    const {proxy} = getCurrentInstance()
    const state = reactive({
      // 权限列表数据
      rightList: [],
       getRightsList:async ()=>{
      const res = await proxy.$http.get('rights/list')
      state.rightList = res.data
    }
    })
    state.getRightsList()
    return {
      ...toRefs(state)
    }
  },
}
</script>

<style scoped lang='less'>
</style>
