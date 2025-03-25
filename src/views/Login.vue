<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">学生管理系统</h2>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="role">
          <el-select
            v-model="loginForm.role"
            placeholder="请选择角色"
            class="w-full"
          >
            <el-option label="管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="w-full" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePermission } from '../hooks/usePermission'

const router = useRouter()
const { setUserRole } = usePermission()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  role: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const handleLogin = async () => {
  loading.value = true
  try {
    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 设置登录状态和用户角色
    localStorage.setItem('isAuthenticated', 'true')
    setUserRole(loginForm.role, loginForm.username)
    
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error) {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.title {
  text-align: center;
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 30px;
}

.login-form {
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.8);
}

:deep(.el-button--primary) {
  height: 40px;
  font-size: 16px;
}
</style> 