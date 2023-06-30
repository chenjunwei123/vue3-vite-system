<template>
<div class="list_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-input
    placeholder=""
    v-model="queryInfo.query" clearable @clear="getGoodsList">
  </el-input>
    </el-col>
    <el-col :span="4">
    <el-button type="primary"
    @click="goAddGoodsPage">添加商品</el-button>
    </el-col>
  </el-row>
  <el-table :data="goodsList" border stripe>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name" align="center"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price" align="center"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="primary">编辑</el-button>
          <el-button type="warning" @click="delGoodsById(scope.row)">删除</el-button>
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
</div>
</template>

<script>
  import {toRefs,reactive, getCurrentInstance} from 'vue'
export default {
  setup () {
    const {proxy} = getCurrentInstance()
    const state = reactive({
      // 商品列表请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 总商品数量
      total: 0,
       // 发起网络请求，得到商品列表数据方法
     getGoodsList:async() =>{
      const res = await proxy.$http.get('goods', state.queryInfo )
      proxy.$msg(res)
      state.goodsList = res.data.goods
      state.total = res.data.total
      state.goodsList.forEach(item => {
        item.add_time = new Date(item.add_time).toLocaleString()
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange:(newSize)=>{
      state.queryInfo.pagesize = newSize
      state.getGoodsList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange:(newPage)=>{
      // console.log(newPage)
      state.queryInfo.pagenum = newPage
      state.getGoodsList()
    },
    // 删除商品
    delGoodsById:async(row)=>{
        const res = await proxy.$http.delete(`goods/${row.goods_id}`)
        proxy.$msg(res)
        state.getGoodsList()
    },
    // 跳转至添加商品页面
    goAddGoodsPage:()=>{
      proxy.$router.push('/goods/add')
    }
    })
    state.getGoodsList()
    return {
      ...toRefs(state)
    }
  },
}
</script>

<style scoped lang='less'>
</style>
