<template>
  <div class="my-scores">
    <el-card class="score-card">
      <template #header>
        <div class="card-header">
          <h3>我的成绩单</h3>
          <el-button type="primary" @click="handleExport">
            导出成绩单
          </el-button>
        </div>
      </template>

      <!-- 成绩统计 -->
      <div class="statistics mb-6">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-value">85.6</div>
                <div class="stat-label">平均分</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-value">95</div>
                <div class="stat-label">最高分</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-value">75</div>
                <div class="stat-label">最低分</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 成绩列表 -->
      <el-table :data="scoreList" stripe>
        <el-table-column prop="courseName" label="课程" />
        <el-table-column prop="score" label="分数" width="100">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.score)">
              {{ row.score }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="100">
          <template #default="{ row }">
            {{ getGradeLabel(row.score) }}
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期" width="120" />
        <el-table-column prop="examDate" label="考试日期" width="120" />
        <el-table-column prop="teacher" label="任课教师" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟成绩数据
const scoreList = ref([
  {
    courseName: '高等数学',
    score: 88,
    semester: '2023-2024-1',
    examDate: '2024-01-15',
    teacher: '张老师'
  },
  {
    courseName: '大学英语',
    score: 92,
    semester: '2023-2024-1',
    examDate: '2024-01-16',
    teacher: '李老师'
  },
  {
    courseName: '计算机基础',
    score: 95,
    semester: '2023-2024-1',
    examDate: '2024-01-17',
    teacher: '王老师'
  },
  {
    courseName: '物理',
    score: 75,
    semester: '2023-2024-1',
    examDate: '2024-01-18',
    teacher: '赵老师'
  }
])

// 获取成绩标签类型
const getScoreTagType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'warning'
  if (score >= 60) return 'info'
  return 'danger'
}

// 获取成绩等级
const getGradeLabel = (score: number) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  if (score >= 60) return '及格'
  return '不及格'
}

// 导出成绩单
const handleExport = () => {
  ElMessage.success('成绩单导出成功')
}
</script>

<style scoped>
.my-scores {
  max-width: 1200px;
  margin: 0 auto;
}

.score-card {
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

.statistics {
  margin: 20px 0;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}
</style> 