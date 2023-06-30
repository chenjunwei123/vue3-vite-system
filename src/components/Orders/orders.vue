<template>
<div class="orders_container">
   <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <div style="margin-top: 5px;">
    <!-- 搜索与添加区域 -->
    <el-row :gutter="40">
      <el-col :span="8">
         <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
           <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
         </el-input>
      </el-col>
    </el-row>
  </div>
  <!-- //用户数据表格区域 -->
<el-table
      border
      stripe
      :data="orderList"
      style="width: 100%">
      <el-table-column align="center" type="index" width="50" label="#"></el-table-column>
      <el-table-column align="center" prop="order_number" label="订单编号" width="250">
      </el-table-column>
      <el-table-column align="center" prop="order_price" label="订单价格" width="180">
      </el-table-column>
      <el-table-column align="center" label="是否付款">
        <template v-slot="scope">
          <el-tag v-if="scope.row.pay_status" type="primary">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="is_send" label="是否发货">
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="下单时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template v-slot="scope">
            <el-button type="primary" round @click="showEditDialog">编辑角色</el-button>
            <el-button type="success" round  @click="showProgressDialog(scope.row)">物流</el-button>
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
<!-- 修改地址对话框 -->
<el-dialog
@close="handleEditAddressDialogClose"
  title="修改地址"
  v-model="editAddressDialogVisiable"
  width="50%">
 <el-form :model="editAddressForm.address" :rules="addAddressRules" ref="editAddressFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市区/县" prop="address">
    <el-cascader :options="cityData" v-model="editAddressForm.address"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="moreAddress">
    <el-input v-model="editAddressForm.moreAddress"></el-input>
  </el-form-item>
 </el-form>
 <template #footer>
  <span class="dialog-footer">
    <el-button @click="editAddressDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editAddressDialogVisiable = false">确 定</el-button>
  </span>
 </template>
</el-dialog>
<!-- 物流信息对话框 -->
<el-dialog
  title="物流信息"
  v-model="progressDialogVisiable"
  width="50%">
   <el-timeline :reverse="false">
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.ftime">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
</div>
</template>

<script>
import cityData from './citydata'
import {toRefs,reactive, getCurrentInstance,ref} from 'vue'
export default {
  setup () {
    const editAddressFromRef = ref()
    const {proxy} = getCurrentInstance()
    const state = reactive({
      // 用于发起网络请求获取用户列表所需的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 所取得的订单数据数组
      orderList: [],
      // 总页数
      total: 0,
      // 编辑订单对话框可视化
      editAddressDialogVisiable: false,
      // 修改地址对象
      editAddressForm: {
        address: [],
        moreAddress: ''
      },
      // 修改地址股则
      addAddressRules: {
        address: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        moreAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 地址数据
      cityData,
      // 物流信息对话框可视化
      progressDialogVisiable: false,
      // 物流信息
      progressInfo: [],
      // 获取用户数据列表方法
     getOrderList:async() =>{
      const res= await proxy.$http.get('orders', state.queryInfo)
      proxy.$msg(res)
      state.orderList = res.data.goods
      state.total = res.data.total
      state.orderList.forEach(item => {
        item.create_time = new Date(item.create_time).toLocaleString()
      })
    },
    // 显示修改地址对话框
    showEditDialog:()=>{
      state.editAddressDialogVisiable = true
    },
    // 监听pagesize改变的事件
    handleSizeChange:(newSize)=>{
      //
      state.queryInfo.pagesize = newSize
      state.getOrderList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange:(newPage)=>{
      //
      state.queryInfo.pagenum = newPage
      state.getOrderList()
    },
    // 监听修改地址对话框的关闭事件
    handleEditAddressDialogClose:()=>{
      editAddressFromRef.value.resetFields()
    },
    // 监听打开物流信息的对话框
     showProgressDialog:async(row)=>{
      state.progressDialogVisiable = true
      const res = await proxy.$http.get('/kuaidi/1106975712662')
      proxy.$msg(res)
      state.progressInfo = res.data
    }
    })
    state.getOrderList()
    return {
      ...toRefs(state),
      editAddressFromRef
    }
  },
}
</script>

<style scoped lang='less'>
</style>
