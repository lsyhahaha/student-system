<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">学生管理系统</h2>
      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="0"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="用户名"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="role">
              <el-select
                v-model="loginForm.role"
                placeholder="请选择角色"
                style="width: 100%"
              >
                <el-option label="管理员" value="admin" />
                <el-option label="教师" value="teacher" />
                <el-option label="学生" value="student" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                style="width: 100%" 
                @click="handleLogin"
                :loading="loading"
              >
                登录
              </el-button>
            </el-form-item>

            <div class="flex justify-between text-sm">
              <el-link type="primary" @click="activeTab = 'register'">注册账号</el-link>
              <el-link type="primary">忘记密码？</el-link>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-width="0"
            class="register-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model.trim="registerForm.username"
                placeholder="请输入用户名"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model.trim="registerForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model.trim="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="role">
              <el-select
                v-model="registerForm.role"
                placeholder="请选择角色"
                style="width: 100%"
              >
                <el-option label="教师" value="teacher" />
                <el-option label="学生" value="student" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" style="width: 100%" @click="handleRegister" :loading="loading">
                注册
              </el-button>
            </el-form-item>

            <div class="text-center text-sm">
              <el-link type="primary" @click="activeTab = 'login'">已有账号？去登录</el-link>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const activeTab = ref('login')

// 表单引用
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  role: ''
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  role: ''
})

// 登录表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 注册表单验证规则
const registerRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录请求
        setTimeout(() => {
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('userRole', loginForm.role)
          localStorage.setItem('userName', loginForm.username)
          ElMessage.success('登录成功')
          router.push('/home')
        }, 1000)
      } finally {
        loading.value = false
      }
    }
  })
}

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟注册请求
        setTimeout(() => {
          ElMessage.success('注册成功')
          activeTab.value = 'login'
          // 清空注册表单
          registerForm.username = ''
          registerForm.password = ''
          registerForm.confirmPassword = ''
          registerForm.role = ''
        }, 1000)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}

.login-form,
.register-form {
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.8);
}

:deep(.el-button--primary) {
  height: 40px;
  font-size: 16px;
}

.w-full {
  width: 100%;
}
</style> 