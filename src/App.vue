<template>
  <el-container class="layout-container">
    <el-header v-if="isAuthenticated">
      <el-menu
        :router="true"
        mode="horizontal"
        :ellipsis="false"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          首页
        </el-menu-item>
        <el-menu-item index="/students">
          <el-icon><User /></el-icon>
          学生管理
        </el-menu-item>
        
        <div class="flex-grow" />
        
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-icon><UserFilled /></el-icon>
            管理员
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-menu>
    </el-header>
    
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
    
    <el-footer v-if="isAuthenticated">
      <p class="text-center text-gray-500">© 2024 学生管理系统</p>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { House, User, UserFilled, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('isAuthenticated')
    isAuthenticated.value = false
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style>
.layout-container {
  min-height: 100vh;
}

.el-header {
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}

.el-footer {
  padding: 20px;
  text-align: center;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
}

.flex-grow {
  flex-grow: 1;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.el-dropdown-link .el-icon {
  margin-right: 4px;
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