<template>
<div class="roles_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-button type="primary" @click="showAddRolesDialog">添加角色</el-button>
    <el-table :data="rolesList" border stripe max-height="700">
      <el-table-column type="expand" align="center">
        <template v-slot='scope'>
          <!-- {{scope.row}} -->
          <el-row :class="['bdbottom',i1==0 ? 'bdtop' : '','vcenter']" v-for="(item,i1) in scope.row.children" :key="item.id">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag type="primary" closable @close="removeRightsById(scope.row,item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级权限和三级权限 -->
            <el-col :span="19">
              <el-row :class="[i2==0 ? '' : 'bdtop','vcenter']" v-for="(item1,i2) in item.children" :key="item1.id">
                <el-col :span="8">
                  <el-tag type="success"  closable @close="removeRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="16">
                  <el-tag type="warning" v-for="(item2) in item1.children" :key="item2.id" closable @close="removeRightsById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
      <el-table-column label="操作" prop="level" align="center">
        <template v-slot="scope">
          <el-button type="primary" @click="showEditRolesDialog(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteRoles(scope.row.id)">删除</el-button>
          <el-button type="warning" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分配权限对话框 -->
  <el-dialog
  title="提示"
  v-model="setRightsDialogVisible"
  width="30%"
  @close="setRightsDialogClose">
  <el-tree show-checkbox :data="rightsList" :props="defaulRightstProps" @check-change="handleCheckChange" node-key="id" :default-expand-all="true" :default-checked-keys="defRightIdList" ref="treeRef"></el-tree>
  <template #footer>
    <span class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
  </template>
</el-dialog>
<!-- 添加角色对话框 -->
<el-dialog
  title="添加角色"
  v-model="addRoleDialogVisible"
  width="50%"
  @close="addRolesDialogClose">
  <el-form :model="addRolesForm" :rules="addRolesrules" ref="addRolesFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
  </template>
</el-dialog>
<!-- 编辑角色对话框 -->
<el-dialog
  title="编辑角色"
  v-model="editRoleDialogVisible"
  width="50%"
  @close="editRolesDialogClose">
  <el-form :model="editRolesForm" :rules="editRolesrules" ref="editRolesFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editRolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editRolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
 <template #footer>
  <span class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
 </template>
</el-dialog>
</div>
</template>

<script>
  import {reactive,getCurrentInstance,ref, toRefs} from 'vue'
export default {
  setup () {
    const treeRef = ref()
    const addRolesFormRef = ref()
    const editRolesFormRef = ref()
    const {proxy} = getCurrentInstance()
    const state = reactive({
       // 角色数据列表
       rolesList: [],
      // 分配权限对话框可视化
      setRightsDialogVisible: false,
      // 权限数组
      rightsList: [],
      // 树形权限规则
      defaulRightstProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的三级权限ID
      defRightIdList: [],
      // 被分配权限的角色ID
      roleId: '',
      // 添加角色对话框可视化
      addRoleDialogVisible: false,
      // 添加角色对象
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色规则
      addRolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框可视化
      editRoleDialogVisible: false,
      // 编辑角色对象
      editRolesForm: {},
      // 编辑角色规则
      editRolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 角色id
      id: '',
      // 获取角色数据列表方法
     getRolesList :async()=>{
      const res = await proxy.$http.get('roles')
      proxy.$msg(res)
      state.rolesList = res.data
    },
    // 删除三级权限
    removeRightsById :async(role, rightId)=>{
        const res = await proxy.$http.delete(`roles/${role.id}/rights/${rightId}`)
        proxy.$msg(res)
        role.children = res.data
      },
    // 点击按钮分配权限
     showSetRightsDialog:async (row)=>{
      const res = await proxy.$http.get('rights/tree')
      proxy.$msg(res)
      state.setRightsDialogVisible = true
      state.rightsList = res.data
      // 将三级权限ID添加至defRightIdList数组中
      state.getLeafKeys(row, state.defRightIdList)
      state.roleId = row.id
    },
    // check点击权限改变事件
    handleCheckChange:()=>{},
    // 定义取得三级权限id的递归函数
    getLeafKeys: (node, arr)=>{
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        state.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭
    setRightsDialogClose :()=>{
      state.defRightIdList = []
    },
    // 分配权限对话框的确定点击事件方法
     allotRights:async ()=>{
      const keys = [...treeRef.value.getCheckedKeys(), treeRef.value.getHalfCheckedKeys()]
      const rids = keys.join(',')
      const res = await proxy.$http.post(`roles/${state.roleId}/rights`, { rids })
      proxy.$msg(res)
      state.setRightsDialogVisible = false
      state.getRolesList()
    },
    // 点击添加角色按,显示添加角色对话框
    showAddRolesDialog:()=>{
      state.addRoleDialogVisible = true
    },
    // 添加角色对话框确定按钮
    addRole:()=>{
      addRolesFormRef.value.validate(async isValid => {
        if (!isValid) return false
        const res = await proxy.$http.post('roles', state.addRolesForm)
        proxy.$msg(res)
        state.addRoleDialogVisible = false
        state.getRolesList()
      })
    },
    // 监听添加角色对话框关闭
    addRolesDialogClose:()=>{
      addRolesFormRef.value.resetFields()
    },
    // 编辑角色对话框确定按钮点击
    editRole:()=>{
      state.editRoleDialogVisible = false
      editRolesFormRef.value.validate(async isValid => {
        if (!isValid) return false
        const res = await proxy.$http.put(`roles/${state.id}`, state.editRolesForm)
        proxy.$msg(res)
        state.getRolesList()
      })
    },
    // 点击编辑按钮，显示编辑角色对话框
    showEditRolesDialog:(row)=>{
      state.editRoleDialogVisible = true
      const { id, roleName, roleDesc } = row
      state.id = id
      state.editRolesForm = {
        roleName, roleDesc
      }
    },
    // 监听编辑角色对话框的关闭事件
    editRolesDialogClose:()=>{
      editRolesFormRef.value.resetFields()
    },
    // 点击删除按钮
    deleteRoles:async(id)=>{
        const res = await proxy.$http.delete(`roles/${id}`)
        proxy.$msg(res)
        state.getRolesList()
      }
    })
    state.getRolesList()
    return {
      ...toRefs(state),
      treeRef,
      addRolesFormRef,
      editRolesFormRef
  }
}
}
</script>

<style scoped lang='less'>
.el-card {
  height: 800px !important;
}
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>