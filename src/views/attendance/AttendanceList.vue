<template>
    <div class="attendance-list">
      <el-card class="mb-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">考勤管理</h2>
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon>导出考勤报表
            </el-button>
          </div>
        </template>
  
        <!-- 快速考勤记录区域 -->
        <div class="mb-6">
          <el-card shadow="hover" class="quick-attendance">
            <template #header>
              <div class="font-bold">快速考勤</div>
            </template>
            <el-form :inline="true" :model="attendanceForm">
              <el-form-item label="班级">
                <el-select v-model="attendanceForm.class" placeholder="请选择班级">
                  <el-option label="计算机科学1班" value="计算机科学1班" />
                  <el-option label="计算机科学2班" value="计算机科学2班" />
                  <el-option label="软件工程1班" value="软件工程1班" />
                  <el-option label="软件工程2班" value="软件工程2班" />
                </el-select>
              </el-form-item>
              <el-form-item label="考勤类型">
                <el-select v-model="attendanceForm.type" placeholder="请选择考勤类型">
                  <el-option label="上课考勤" value="class" />
                  <el-option label="实验课考勤" value="lab" />
                  <el-option label="活动考勤" value="activity" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="startAttendance">
                  开始考勤
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
  
        <div class="grid grid-cols-3 gap-6">
          <!-- 日历视图 -->
          <div class="col-span-2">
            <el-card shadow="never" class="calendar-view">
              <template #header>
                <div class="font-bold">考勤日历</div>
              </template>
              <el-calendar v-model="currentDate">
                <template #dateCell="{ data }">
                  <div class="calendar-cell">
                    <p :class="data.isSelected ? 'is-selected' : ''">
                      {{ data.day.split('-').slice(2).join('') }}
                      {{ getAttendanceStatus(data.day) }}
                    </p>
                    <div class="attendance-indicators">
                      <el-tag v-if="hasAttendance(data.day, 'normal')" size="small" type="success">正常</el-tag>
                      <el-tag v-if="hasAttendance(data.day, 'late')" size="small" type="warning">迟到</el-tag>
                      <el-tag v-if="hasAttendance(data.day, 'absent')" size="small" type="danger">缺勤</el-tag>
                      <el-tag v-if="hasAttendance(data.day, 'leave')" size="small" type="info">请假</el-tag>
                    </div>
                  </div>
                </template>
              </el-calendar>
            </el-card>
          </div>
  
          <!-- 请假审批列表 -->
          <div class="col-span-1">
            <el-card shadow="never" class="leave-requests">
              <template #header>
                <div class="flex justify-between items-center">
                  <span class="font-bold">请假审批</span>
                  <el-button type="primary" link @click="showAllLeaveRequests">
                    查看全部
                  </el-button>
                </div>
              </template>
              <el-table :data="leaveRequests" style="width: 100%" :max-height="300">
                <el-table-column prop="studentName" label="学生" width="80" />
                <el-table-column prop="type" label="类型" width="80">
                  <template #default="{ row }">
                    <el-tag :type="getLeaveTypeTag(row.type)">
                      {{ row.type }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                  <template #default="{ row }">
                    <el-tag :type="getStatusTag(row.status)">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="{ row }">
                    <el-button v-if="row.status === '待审批'" type="primary" link @click="handleApprove(row)">
                      审批
                    </el-button>
                    <el-button type="info" link @click="handleViewDetail(row)">
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
  
        <!-- 考勤统计报表 -->
        <el-card shadow="never" class="mt-6">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold">考勤统计</span>
              <div class="flex gap-4">
                <el-select v-model="statsFilter.class" placeholder="选择班级" clearable>
                  <el-option label="计算机科学1班" value="计算机科学1班" />
                  <el-option label="计算机科学2班" value="计算机科学2班" />
                  <el-option label="软件工程1班" value="软件工程1班" />
                  <el-option label="软件工程2班" value="软件工程2班" />
                </el-select>
                <el-date-picker
                  v-model="statsFilter.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="dateShortcuts"
                />
              </div>
            </div>
          </template>
          <div class="grid grid-cols-2 gap-6">
            <el-card shadow="never">
              <div class="h-[300px]">
                <el-chart :option="attendanceStatsOption" autoresize />
              </div>
            </el-card>
            <el-card shadow="never">
              <div class="h-[300px]">
                <el-chart :option="attendanceTrendOption" autoresize />
              </div>
            </el-card>
          </div>
        </el-card>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Download } from '@element-plus/icons-vue'
  import type { ECOption } from '@/types/echarts'
  
  // 当前日期
  const currentDate = ref(new Date())
  
  // 快速考勤表单
  const attendanceForm = reactive({
    class: '',
    type: ''
  })
  
  // 请假审批列表数据
  const leaveRequests = ref([
    {
      id: 1,
      studentName: '张三',
      type: '病假',
      status: '待审批',
      startDate: '2024-03-25',
      endDate: '2024-03-26',
      reason: '感冒发烧'
    },
    {
      id: 2,
      studentName: '李四',
      type: '事假',
      status: '已通过',
      startDate: '2024-03-27',
      endDate: '2024-03-27',
      reason: '家中有事'
    }
  ])
  
  // 统计筛选条件
  const statsFilter = reactive({
    class: '',
    dateRange: []
  })
  
  // 日期快捷选项
  const dateShortcuts = [
    {
      text: '最近一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      }
    },
    {
      text: '最近一月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      }
    }
  ]
  
  // 考勤状态判断
  const getAttendanceStatus = (day: string) => {
    // TODO: 根据实际考勤数据返回状态
    return ''
  }
  
  const hasAttendance = (day: string, type: string) => {
    // TODO: 根据实际考勤数据判断是否有对应类型的考勤记录
    return Math.random() > 0.7
  }
  
  // 请假类型标签
  const getLeaveTypeTag = (type: string) => {
    const types: Record<string, string> = {
      '病假': 'danger',
      '事假': 'warning',
      '其他': 'info'
    }
    return types[type] || 'info'
  }
  
  // 审批状态标签
  const getStatusTag = (status: string) => {
    const statuses: Record<string, string> = {
      '待审批': 'warning',
      '已通过': 'success',
      '已拒绝': 'danger'
    }
    return statuses[status] || 'info'
  }
  
  // 考勤统计图表配置
  const attendanceStatsOption = computed<ECOption>(() => ({
    title: {
      text: '考勤状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}人\n{d}%'
        },
        data: [
          { value: 85, name: '正常', itemStyle: { color: '#67C23A' } },
          { value: 10, name: '迟到', itemStyle: { color: '#E6A23C' } },
          { value: 3, name: '缺勤', itemStyle: { color: '#F56C6C' } },
          { value: 2, name: '请假', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }))
  
  const attendanceTrendOption = computed<ECOption>(() => ({
    title: {
      text: '考勤趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['出勤率', '迟到率', '缺勤率'],
      bottom: '5%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五']
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '出勤率',
        type: 'line',
        data: [95, 93, 96, 94, 95],
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '迟到率',
        type: 'line',
        data: [3, 5, 2, 4, 3],
        itemStyle: { color: '#E6A23C' }
      },
      {
        name: '缺勤率',
        type: 'line',
        data: [2, 2, 2, 2, 2],
        itemStyle: { color: '#F56C6C' }
      }
    ]
  }))
  
  // 开始考勤
  const startAttendance = () => {
    if (!attendanceForm.class || !attendanceForm.type) {
      ElMessage.warning('请选择班级和考勤类型')
      return
    }
    // TODO: 实现考勤功能
    ElMessage.success('考勤已开始')
  }
  
  // 查看所有请假申请
  const showAllLeaveRequests = () => {
    // TODO: 实现查看所有请假申请功能
  }
  
  // 审批请假
  const handleApprove = (row: any) => {
    ElMessageBox.confirm(
      `是否通过 ${row.studentName} 的${row.type}申请？`,
      '请假审批',
      {
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning'
      }
    ).then(() => {
      row.status = '已通过'
      ElMessage.success('审批通过')
    }).catch(() => {
      row.status = '已拒绝'
      ElMessage.info('审批已拒绝')
    })
  }
  
  // 查看请假详情
  const handleViewDetail = (row: any) => {
    ElMessageBox.alert(
      `请假时间：${row.startDate} 至 ${row.endDate}\n请假原因：${row.reason}`,
      '请假详情',
      {
        confirmButtonText: '确定'
      }
    )
  }
  
  // 导出考勤报表
  const handleExport = () => {
    // TODO: 实现导出功能
    ElMessage.success('考勤报表导出成功')
  }
  </script>
  
  <style scoped>
  .attendance-list {
    padding: 20px;
  }
  
  .calendar-cell {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px;
  }
  
  .attendance-indicators {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }
  
  .attendance-indicators .el-tag {
    margin-right: 0;
  }
  
  .is-selected {
    color: #409EFF;
    font-weight: bold;
  }
  </style>