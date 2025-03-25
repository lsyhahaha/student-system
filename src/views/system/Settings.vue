<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h3>系统设置</h3>
        </div>
      </template>

      <el-tabs>
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置">
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" />
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
              >
                <img v-if="basicSettings.logo" :src="basicSettings.logo" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="主题色">
              <el-color-picker v-model="basicSettings.theme" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 用户管理 -->
        <el-tab-pane label="用户管理">
          <div class="action-bar">
            <el-button type="primary" @click="handleAddUser">
              <el-icon><Plus /></el-icon>添加用户
            </el-button>
          </div>
          <el-table :data="userList" stripe>
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="role" label="角色">
              <template #default="{ row }">
                <el-tag :type="getRoleTagType(row.role)">{{ getRoleLabel(row.role) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-switch v-model="row.status" />
              </template>
            </el-table-column>
            <el-table-column prop="lastLogin" label="最后登录" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button-group>
                  <el-button type="primary" link @click="handleEditUser(row)">编辑</el-button>
                  <el-button type="danger" link @click="handleDeleteUser(row)">删除</el-button>
                  <el-button type="warning" link @click="handleResetPassword(row)">重置密码</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置">
          <el-form :model="securitySettings" label-width="200px">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securitySettings.minPasswordLength" :min="6" :max="20" />
            </el-form-item>
            <el-form-item label="密码复杂度要求">
              <el-checkbox-group v-model="securitySettings.passwordRules">
                <el-checkbox label="uppercase">必须包含大写字母</el-checkbox>
                <el-checkbox label="lowercase">必须包含小写字母</el-checkbox>
                <el-checkbox label="number">必须包含数字</el-checkbox>
                <el-checkbox label="special">必须包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="登录失败锁定次数">
              <el-input-number v-model="securitySettings.loginAttempts" :min="3" :max="10" />
            </el-form-item>
            <el-form-item label="会话超时时间(分钟)">
              <el-input-number v-model="securitySettings.sessionTimeout" :min="5" :max="120" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 基本设置
const basicSettings = reactive({
  systemName: '学生管理系统',
  logo: '',
  theme: '#409EFF'
})

// 安全设置
const securitySettings = reactive({
  minPasswordLength: 8,
  passwordRules: ['uppercase', 'number'],
  loginAttempts: 5,
  sessionTimeout: 30
})

// 用户列表
const userList = ref([
  {
    username: 'admin',
    role: 'admin',
    status: true,
    lastLogin: '2024-03-25 10:30:00'
  },
  {
    username: 'teacher1',
    role: 'teacher',
    status: true,
    lastLogin: '2024-03-24 16:45:00'
  },
  {
    username: 'student1',
    role: 'student',
    status: true,
    lastLogin: '2024-03-25 09:15:00'
  }
])

// 获取角色标签类型
const getRoleTagType = (role: string) => {
  const types: Record<string, string> = {
    admin: 'danger',
    teacher: 'warning',
    student: 'info'
  }
  return types[role] || 'info'
}

// 获取角色标签文本
const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: '管理员',
    teacher: '教师',
    student: '学生'
  }
  return labels[role] || '未知'
}

// 保存基本设置
const saveBasicSettings = () => {
  ElMessage.success('基本设置保存成功')
}

// 保存安全设置
const saveSecuritySettings = () => {
  ElMessage.success('安全设置保存成功')
}

// 用户管理相关操作
const handleAddUser = () => {
  // TODO: 实现添加用户功能
}

const handleEditUser = (user: any) => {
  // TODO: 实现编辑用户功能
}

const handleDeleteUser = (user: any) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${user.username} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('用户删除成功')
  })
}

const handleResetPassword = (user: any) => {
  ElMessageBox.confirm(
    `确定要重置用户 ${user.username} 的密码吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('密码重置成功')
  })
}
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.action-bar {
  margin-bottom: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 