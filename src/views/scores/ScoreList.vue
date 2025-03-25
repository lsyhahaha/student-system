<template>
  <div class="score-list">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">成绩管理</h2>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出成绩单
          </el-button>
        </div>
      </template>

      <!-- 筛选区域 -->
      <div class="mb-4">
        <el-form :inline="true" :model="filterForm" class="flex flex-wrap gap-4">
          <el-form-item label="班级">
            <el-select v-model="filterForm.class" placeholder="请选择班级" clearable @change="handleFilter">
              <el-option label="计算机科学1班" value="计算机科学1班" />
              <el-option label="计算机科学2班" value="计算机科学2班" />
              <el-option label="软件工程1班" value="软件工程1班" />
              <el-option label="软件工程2班" value="软件工程2班" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程">
            <el-select v-model="filterForm.course" placeholder="请选择课程" clearable @change="handleFilter">
              <el-option label="高等数学" value="高等数学" />
              <el-option label="大学英语" value="大学英语" />
              <el-option label="Java程序设计" value="Java程序设计" />
              <el-option label="数据结构" value="数据结构" />
              <el-option label="操作系统" value="操作系统" />
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 显示已选择的筛选条件 -->
        <div v-if="filterForm.class || filterForm.course" class="mt-2 text-gray-600 text-sm">
          当前筛选：
          <el-tag v-if="filterForm.class" class="mr-2" closable @close="filterForm.class = ''">
            班级：{{ filterForm.class }}
          </el-tag>
          <el-tag v-if="filterForm.course" class="mr-2" closable @close="filterForm.course = ''">
            课程：{{ filterForm.course }}
          </el-tag>
        </div>
      </div>

      <!-- 成绩分析图表 -->
      <div class="flex flex-row gap-6 mb-4">
        <!-- 左侧成绩分布图 -->
        <el-card shadow="never" class="w-[45%] h-[400px]">
          <template #header>
            <div class="font-bold">成绩分布</div>
          </template>
          <div class="h-full">
            <el-chart :option="pieOption" autoresize />
          </div>
        </el-card>
        <!-- 右侧平均分对比图 -->
        <el-card shadow="never" class="w-[55%] h-[400px]">
          <template #header>
            <div class="font-bold">平均分对比</div>
          </template>
          <div class="h-full">
            <el-chart :option="barOption" autoresize />
          </div>
        </el-card>
      </div>

      <!-- 成绩录入表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
        :max-height="tableMaxHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column prop="id" label="学号" width="100" fixed="left" />
        <el-table-column prop="name" label="姓名" width="100" fixed="left" />
        <el-table-column prop="class" label="班级" min-width="140" />
        <el-table-column prop="course" label="课程" min-width="120" />
        <el-table-column label="成绩" width="160">
          <template #default="{ row }">
            <el-input-number
              v-model="row.score"
              :min="0"
              :max="100"
              :precision="1"
              :step="0.5"
              :controls="false"
              class="w-24"
              @change="handleScoreChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getScoreTagType(row.score)">
              {{ getScoreLevel(row.score) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import type { ECOption } from '@/types/echarts'

// 筛选表单
const filterForm = reactive({
  class: '',
  course: ''
})

// 表格数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 模拟数据
const generateScoreData = () => {
  const data = []
  const courses = ['高等数学', '大学英语', 'Java程序设计', '数据结构', '操作系统']
  const classes = ['计算机科学1班', '计算机科学2班', '软件工程1班', '软件工程2班']
  
  for (let i = 0; i < 100; i++) {
    const courseIndex = i % courses.length
    const classIndex = Math.floor(i / 25)
    data.push({
      id: `2024${String(i + 1).padStart(3, '0')}`,
      name: `学生${i + 1}`,
      class: classes[classIndex],
      course: courses[courseIndex],
      score: Math.floor(Math.random() * 40) + 60, // 60-100之间的随机数
      updateTime: new Date().toLocaleString()
    })
  }
  return data
}

const allData = ref(generateScoreData())

// 根据筛选条件过滤数据
const filteredData = computed(() => {
  return allData.value.filter(item => {
    const classMatch = !filterForm.class || item.class === filterForm.class
    const courseMatch = !filterForm.course || item.course === filterForm.course
    return classMatch && courseMatch
  })
})

// 当前页数据
const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 成绩等级判断
const getScoreLevel = (score: number) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  if (score >= 60) return '及格'
  return '不及格'
}

const getScoreTagType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 70) return 'warning'
  if (score >= 60) return 'info'
  return 'danger'
}

// 饼图配置
const pieOption = computed<ECOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}人 ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    top: 'bottom',
    left: 'center',
    itemWidth: 25,
    itemHeight: 14
  },
  series: [
    {
      name: '成绩分布',
      type: 'pie',
      radius: '50%',
      center: ['50%', '40%'],
      label: {
        show: true,
        formatter: '{b}: {c}人\n{d}%',
        position: 'outside'
      },
      data: [
        { 
          value: filteredData.value.filter(item => item.score >= 90).length, 
          name: '优秀',
          itemStyle: { color: '#409EFF' }
        },
        { 
          value: filteredData.value.filter(item => item.score >= 80 && item.score < 90).length, 
          name: '良好',
          itemStyle: { color: '#67C23A' }
        },
        { 
          value: filteredData.value.filter(item => item.score >= 70 && item.score < 80).length, 
          name: '中等',
          itemStyle: { color: '#E6A23C' }
        },
        { 
          value: filteredData.value.filter(item => item.score >= 60 && item.score < 70).length, 
          name: '及格',
          itemStyle: { color: '#F56C6C' }
        },
        { 
          value: filteredData.value.filter(item => item.score < 60).length, 
          name: '不及格',
          itemStyle: { color: '#909399' }
        }
      ]
    }
  ]
}))

// 柱状图配置
const barOption = computed<ECOption>(() => {
  const courses = Array.from(new Set(filteredData.value.map(item => item.course)))
  const classes = Array.from(new Set(filteredData.value.map(item => item.class)))
  
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      left: 'center'
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: courses,
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '平均分',
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: classes.map(className => ({
      name: className,
      type: 'bar',
      barWidth: '20%',
      barGap: '30%',
      data: courses.map(course => {
        const scores = filteredData.value
          .filter(item => item.class === className && item.course === course)
          .map(item => item.score)
        return scores.length ? Math.round(scores.reduce((a, b) => a + b) / scores.length * 10) / 10 : 0
      })
    }))
  }
})

// 处理筛选
const handleFilter = () => {
  currentPage.value = 1
  total.value = filteredData.value.length
  // 重新计算表格高度
  updateTableHeight()
}

// 处理成绩变更
const handleScoreChange = (row: any) => {
  row.updateTime = new Date().toLocaleString()
  ElMessage.success('成绩更新成功')
}

// 处理编辑
const handleEdit = (row: any) => {
  // TODO: 实现编辑功能
}

// 处理删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 的 ${row.course} 成绩记录吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除功能
    ElMessage.success('删除成功')
  })
}

// 导出成绩单
const handleExport = () => {
  try {
    // 准备导出数据
    const exportData = filteredData.value.map(item => ({
      '学号': item.id,
      '姓名': item.name,
      '班级': item.class,
      '课程': item.course,
      '成绩': item.score,
      '等级': getScoreLevel(item.score),
      '更新时间': item.updateTime
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // 设置列宽
    ws['!cols'] = [
      { wch: 10 }, // 学号
      { wch: 10 }, // 姓名
      { wch: 15 }, // 班级
      { wch: 15 }, // 课程
      { wch: 8 },  // 成绩
      { wch: 8 },  // 等级
      { wch: 20 }  // 更新时间
    ]

    // 添加sheet
    XLSX.utils.book_append_sheet(wb, ws, '成绩单')

    // 导出文件
    const fileName = `成绩单_${filterForm.class || '全部班级'}_${filterForm.course || '全部课程'}_${new Date().toLocaleDateString()}.xlsx`
    XLSX.writeFile(wb, fileName)
    ElMessage.success('成绩单导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleFilter()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 在 script setup 部分添加
const tableMaxHeight = ref(500)

// 动态计算表格高度
const updateTableHeight = () => {
  // 获取视口高度
  const vh = window.innerHeight
  // 减去其他元素的高度（头部、筛选区域、图表区域、分页等）
  // 预留 200px 给其他元素
  tableMaxHeight.value = vh - 200
}

// 监听窗口大小变化
onMounted(() => {
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableHeight)
})
</script>

<style scoped>
.score-list {
  padding: 20px;
}
</style> 