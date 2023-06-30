<template>
<div class="params_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <el-alert
    :closable=false
    title="注意:只允许为第三级分类设置相关参数"
    type="warning"
    show-icon>
  </el-alert>
  <el-row>
    <el-col>
      <span>选择商品分类:  </span>
      <el-cascader
        v-model="selectKey"
        :options="cateList"
        :props="cascaderProps"
        @change="parentCateChange">
        </el-cascader>
    </el-col>
  </el-row>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" :disabled="!isBtnDisable" @click="addAttr">添加参数</el-button>
      <el-table :data="manyTableData" border stripe>
        <el-table-column type="expand" align="center">
          <template v-slot="scope">
            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeTags(scope.row,index)">{{item}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInputRef"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
         <el-table-column type="index" label="#" align="center"></el-table-column>
         <el-table-column label="参数名称" align="center" prop="attr_name"></el-table-column>
         <el-table-column label="操作" align="center">
           <template v-slot="scope">
             <el-button type="primary" @click="showEditDialog(scope.row)">编辑</el-button>
             <el-button type="danger" @click="deleteParams(scope.row)">删除</el-button>
           </template>
         </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" :disabled="!isBtnDisable" @click="addAttr">添加参数</el-button>
      <el-table :data="onlyTableData" border stripe>
        <el-table-column type="expand" align="center">
          <template v-slot="scope">
            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeTags(scope.row,index)">{{item}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInputRef"
              size="small"
              @keyup.enter="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
         <el-table-column type="index" label="#" align="center"></el-table-column>
         <el-table-column label="属性名称" align="center" prop="attr_name"></el-table-column>
         <el-table-column label="操作" align="center">
           <template v-slot="scope">
             <el-button type="primary" @click="showEditDialog(scope.row)">编辑</el-button>
             <el-button type="danger" @click="deleteParams(scope.row)">删除</el-button>
           </template>
         </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
<!-- 添加参数对话框 -->
<el-dialog
  @close="addAttrDialogClose"
  :title="'添加'+titleText"
  v-model="addAttrDialogVisible"
  width="50%">
  <el-form :model="addAttrForm" :rules="addAttrFormRules" ref="addAttrFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addAttrForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
    <el-button @click="addAttrDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAttrSubmit">确 定</el-button>
  </span>
  </template>
</el-dialog>
<!-- 编辑参数对话框 -->
<el-dialog
  @close="editAttrDialogClose"
  :title="'编辑参数'+titleText"
  v-model="editAttrDialogVisible"
  width="50%">
  <el-form :model="editAttrForm" :rules="editAttrFormRules" ref="editAttrFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editAttrForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
    <el-button @click="editAttrDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAttrSubmit">确 定</el-button>
  </span>
  </template>
</el-dialog>
</div>
</template>

<script>
import {reactive,ref,getCurrentInstance,toRefs,computed,nextTick} from 'vue'
export default {
  setup () {
    const addAttrFormRef = ref()
    const editAttrFormRef = ref()
    const saveTagInputRef = ref()
    const {proxy} = getCurrentInstance()
    const state = reactive({
      // 添加参数按钮是否启用
      isBtnDisable:computed(()=>{
        return state.selectKey.length === 3
      }),
      // 当前选中的三级分类ID
      cateId:computed(()=>{
        return state.selectKey[state.selectKey.length - 1]
      }),
      // 区分添加参数/添加属性对话框的title
      titleText:computed(()=>{
        return state.activeName === 'many' ? '动态参数' : '静态属性'
      }),
       // 商品分类数据列表
       cateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选中的父级Id数组
      selectKey: [],
      // 被选中标签名字
      activeName: 'many',
      // 动态属性列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 添加参数对话框可视化
      addAttrDialogVisible: false,
      // 添加对话框参数/属性
      addAttrForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 添加对话框表单规则
      addAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 编辑对话框可视化
      editAttrDialogVisible: false,
      // 编辑表单数据对象
      editAttrForm: {},
      // 编辑表单数据规则对象
      editAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 添加标签Input的可视化
      inputVisible: false,
      // 添加标签Input的Value值
      inputValue: '',
      // 发起网络请求，得到商品分类数据方法
     getCateList:async()=>{
      const res = await proxy.$http.get('categories')
      proxy.$msg(res)
      state.cateList = res.data
    },
    // 选择项发生变法
     parentCateChange:async ()=>{
      state.getParamsData()
    },
    // 标签点击事件方法
    handleTabClick:()=>{
      state.getParamsData()
    },
    // 获取参数列表数据
     getParamsData:async ()=>{
      if (state.selectKey.length !== 3) {
        state.selectKey = []
        state.manyTableData = []
        state.onlyTableData = []
        return false
      } else {
        const res = await proxy.$http.get(`categories/${state.cateId}/attributes`, { sel: state.activeName })
        proxy.$msg(res)
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
          item.inputVisible = false
          item.inputValue = ''
        })
        if (state.activeName === 'many') {
          state.manyTableData = res.data
        } else {
          state.onlyTableData = res.data
        }
      }
    },
    // 添加参数/属性
    addAttr:()=>{
      state.addAttrDialogVisible = true
    },
    // 监听添加参数/属性对话框的关闭
    addAttrDialogClose:()=>{
      addAttrFormRef.value.resetFields()
      state.addAttrForm = {}
    },
    // 添加参数对话框确定按钮点击事件
    addAttrSubmit:()=>{
        addAttrFormRef.value.validate(async isValid => {
        if (!isValid) return false
        state.addAttrForm.attr_sel = state.activeName
        const res = await proxy.$http.post(`categories/${state.cateId}/attributes`, state.addAttrForm)
        proxy.$msg(res)
        state.getParamsData()
        state.addAttrDialogVisible = false
      })
    },
    // 显示编辑对话框
     showEditDialog:async(cate)=>{
      state.editAttrDialogVisible = true
      const res= await proxy.$http.get(`categories/${cate.cat_id}/attributes/${cate.attr_id}`, { attr_sel: state.activeName })
      proxy.$msg(res)
      state.editAttrForm = res.data
    },
    // 监听编辑对话框的关闭
    editAttrDialogClose:()=>{
      editAttrFormRef.value.resetFields()
    },
    // 编辑属性对话框确定按钮点击事件
    editAttrSubmit:()=>{
        editAttrFormRef.value.validate(async isValid => {
        if (!isValid) return false
        const { attr_name, attr_sel, attr_id } = state.editAttrForm
        const res = await proxy.$http.put(`categories/${state.cateId}/attributes/${attr_id}`, { attr_name, attr_sel })
        proxy.$msg(res)
        state.getParamsData()
        state.editAttrDialogVisible = false
      })
    },
    // 删除参数
     deleteParams:async(row)=>{
      const { attr_id, cat_id } = row
      const res = await proxy.$http.delete(`categories/${cat_id}/attributes/${attr_id}`)
      proxy.$msg(res)
      state.getParamsData()
    },
    // 显示添加标签的Input框
    showInput:(item)=>{
      item.inputVisible = true
      // $nextTick()的作用，就是当页面元素被重新渲染之后才会执行灰调函数中的代码
      nextTick(() => {
        // saveTagInputRef.value.focus()
        // console.log(saveTagInputRef);
      })
    },
    // 处理输入添加标签数据INput中的数据
     handleInputConfirm:async (item)=>{
      if (item.inputValue.trim() === '') {
        item.inputValue = ''
        return false
      }
      // 添加标签
      item.inputVisible = false
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      const attr_vals = item.attr_vals.join(',')
      const { attr_id, cat_id, attr_name } = item
      const res = await proxy.$http.put(`categories/${cat_id}/attributes/${attr_id}`, { attr_name, attr_sel: proxy.activeName, attr_vals })
      proxy.$msg(res)
    },
     removeTags:async(item, index)=>{
      // 删除标签
      item.attr_vals.splice(index, 1)
      const attr_vals = item.attr_vals.join(',')
      const { attr_id, cat_id, attr_name } = item
      const { data: res } = await proxy.$http.put(`categories/${cat_id}/attributes/${attr_id}`, { attr_name, attr_sel: state.activeName, attr_vals })
    }
    })
    return {
     ...toRefs(state),
     addAttrFormRef,
     editAttrFormRef,
     saveTagInputRef
    }
  },
  methods: {

  },
  created () {
    this.getCateList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
.input-new-tag {
  width: 100px !important;
}
</style>
