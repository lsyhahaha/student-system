<template>
  <el-container class="app-container">
    <el-aside width="200px" class="aside">
      <div class="logo">
        <el-icon :size="32" class="logo-icon"><School /></el-icon>
        <span class="logo-text">学生管理系统</span>
      </div>
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item
          v-for="menu in userMenus"
          :key="menu.path"
          :index="menu.path"
        >
          <el-icon><component :is="menu.icon" /></el-icon>
          <span>{{ menu.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left"></div>
        <div class="header-right">
          <span class="welcome-text">{{ getGreeting() }}，{{ userInfo.name }}</span>
          <el-dropdown @command="handleCommand">
            <el-avatar :size="32" class="user-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { User, School } from '@element-plus/icons-vue'
import { usePermission } from './hooks/usePermission'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const { userInfo, userMenus } = usePermission()

// 问候语
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'password':
      // TODO: 实现修改密码功能
      break
    case 'logout':
      // 清除登录状态
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userName')
      ElMessage.success('已退出登录')
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  color: #fff;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #2b3648;
}

.logo-icon {
  margin-right: 8px;
}

.logo-text {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.el-menu-vertical {
  border-right: none;
  background-color: #304156;
}

.el-menu-vertical :deep(.el-menu-item) {
  color: #bfcbd9;
}

.el-menu-vertical :deep(.el-menu-item.is-active) {
  color: #409eff;
  background-color: #263445;
}

.el-menu-vertical :deep(.el-menu-item:hover) {
  color: #fff;
  background-color: #263445;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  font-size: 14px;
  color: #606266;
}

.user-avatar {
  cursor: pointer;
  background-color: #409eff;
  color: #fff;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>