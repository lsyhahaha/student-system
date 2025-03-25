<template>
  <div class="home">
    <el-row class="mb-4">
      <el-col :span="24">
        <h1 class="text-3xl font-bold text-center mb-8">学生管理系统</h1>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="text-center">
          <el-icon class="text-4xl mb-4"><User /></el-icon>
          <h2 class="text-xl mb-2">学生管理</h2>
          <p class="text-gray-600">管理学生信息、成绩等数据</p>
          <el-button type="primary" class="mt-4" @click="$router.push('/students')">
            进入管理
          </el-button>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="text-center">
          <el-icon class="text-4xl mb-4"><Document /></el-icon>
          <h2 class="text-xl mb-2">成绩管理</h2>
          <p class="text-gray-600">查看和录入学生成绩</p>
          <el-button type="primary" class="mt-4" disabled>
            即将推出
          </el-button>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="text-center">
          <el-icon class="text-4xl mb-4"><DataLine /></el-icon>
          <h2 class="text-xl mb-2">数据统计</h2>
          <p class="text-gray-600">查看各类数据统计报表</p>
          <el-button type="primary" class="mt-4" disabled>
            即将推出
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Document, DataLine } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  padding: 20px;
}
</style> 