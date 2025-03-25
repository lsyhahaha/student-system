<template>
  <div class="my-attendance">
    <el-card class="attendance-card">
      <template #header>
        <div class="card-header">
          <h3>我的考勤记录</h3>
          <el-button type="primary" @click="handleExport">
            导出考勤记录
          </el-button>
        </div>
      </template>

      <!-- 考勤统计 -->
      <div class="statistics mb-6">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-value text-success">98%</div>
                <div class="stat-label">出勤率</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-value text-primary">125</div>
                <div class="stat-label">正常出勤</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-value text-warning">2</div>
                <div class="stat-label">迟到</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-value text-danger">1</div>
                <div class="stat-label">缺勤</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 考勤记录 -->
      <el-table :data="attendanceList" stripe>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="course" label="课程" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="120" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column prop="teacher" label="任课教师" width="120" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="100"
          background
          layout="prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const currentPage = ref(1)

// 模拟考勤数据
const attendanceList = ref([
  {
    date: '2024-03-25',
    course: '高等数学',
    status: 'normal',
    time: '08:00-09:40',
    location: '教学楼A-101',
    teacher: '张老师'
  },
  {
    date: '2024-03-25',
    course: '大学英语',
    status: 'normal',
    time: '10:00-11:40',
    location: '教学楼B-203',
    teacher: '李老师'
  },
  {
    date: '2024-03-24',
    course: '计算机基础',
    status: 'late',
    time: '14:00-15:40',
    location: '实验楼C-305',
    teacher: '王老师'
  },
  {
    date: '2024-03-24',
    course: '物理',
    status: 'absent',
    time: '16:00-17:40',
    location: '教学楼A-205',
    teacher: '赵老师'
  }
])

// 获取状态标签类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    normal: 'success',
    late: 'warning',
    absent: 'danger',
    leave: 'info'
  }
  return types[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    normal: '正常',
    late: '迟到',
    absent: '缺勤',
    leave: '请假'
  }
  return labels[status] || '未知'
}

// 导出考勤记录
const handleExport = () => {
  ElMessage.success('考勤记录导出成功')
}
</script>

<style scoped>
.my-attendance {
  max-width: 1200px;
  margin: 0 auto;
}

.attendance-card {
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
  margin-bottom: 8px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.text-success {
  color: #67C23A;
}

.text-primary {
  color: #409EFF;
}

.text-warning {
  color: #E6A23C;
}

.text-danger {
  color: #F56C6C;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 