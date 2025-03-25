<template>
  <div class="student-list">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">学生信息管理</h2>
          <el-button type="primary" @click="$router.push('/students/add')">
            <el-icon><Plus /></el-icon>添加学生
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选区域 -->
      <div class="mb-4">
        <el-form :inline="true" :model="searchForm" class="flex flex-wrap gap-4">
          <el-form-item label="学号">
            <el-input v-model="searchForm.id" placeholder="请输入学号" clearable />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="班级">
            <el-select v-model="searchForm.class" placeholder="请选择班级" clearable>
              <el-option label="计算机科学1班" value="计算机科学1班" />
              <el-option label="计算机科学2班" value="计算机科学2班" />
              <el-option label="软件工程1班" value="软件工程1班" />
              <el-option label="软件工程2班" value="软件工程2班" />
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="searchForm.gender" placeholder="请选择性别" clearable>
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 批量操作区域 -->
      <div class="mb-4 flex items-center gap-2">
        <el-upload
          class="mr-2"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xlsx,.xls"
          @change="handleImport"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>批量导入
          </el-button>
        </el-upload>
        <el-button
          type="danger"
          :disabled="!selectedStudents.length"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
        <el-button
          type="success"
          :disabled="!selectedStudents.length"
          @click="handleBatchExport"
        >
          <el-icon><Download /></el-icon>批量导出
        </el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="students"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="学号" width="120" sortable />
        <el-table-column prop="name" label="姓名" width="120" sortable />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === 'male' ? 'primary' : 'success'">
              {{ row.gender === 'male' ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" sortable />
        <el-table-column prop="class" label="班级" sortable />
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '在读' : '休学' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="success" size="small" @click="handleView(row)">
                详情
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-gray-500">
          已选择 {{ selectedStudents.length }} 项
        </div>
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

    <!-- 详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'view' ? '学生详情' : '编辑学生'"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="学号">{{ currentStudent.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentStudent.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentStudent.gender === 'male' ? '男' : '女' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentStudent.age }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ currentStudent.class }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentStudent.email }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentStudent.status === 'active' ? 'success' : 'danger'">
            {{ currentStudent.status === 'active' ? '在读' : '休学' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="入学时间">{{ currentStudent.enrollmentDate }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentStudent.remark }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleEdit(currentStudent)" v-if="dialogType === 'view'">
            编辑
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Delete, Download, Upload } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

const router = useRouter()
const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'view' | 'edit'>('view')
const selectedStudents = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)

// 生成随机学生信息的函数
const generateRandomStudent = (index: number) => {
  const classes = ['计算机科学1班', '计算机科学2班', '软件工程1班', '软件工程2班']
  const genders = ['male', 'female']
  const statuses = ['active', 'inactive']
  
  return {
    id: `2024${String(index + 1).padStart(3, '0')}`,
    name: `学生${index + 1}`,
    gender: genders[Math.floor(Math.random() * genders.length)],
    age: Math.floor(Math.random() * 3) + 18, // 18-20岁
    class: classes[Math.floor(Math.random() * classes.length)],
    email: `student${index + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    enrollmentDate: '2024-09-01',
    remark: `这是学生${index + 1}的备注信息`
  }
}

// 生成100个模拟数据
const allStudents = ref(Array.from({ length: 100 }, (_, index) => generateRandomStudent(index)))

// 计算当前页显示的数据
const students = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allStudents.value.slice(start, end)
})

// 搜索表单
const searchForm = reactive({
  id: '',
  name: '',
  class: '',
  gender: ''
})

// 当前查看的学生信息
const currentStudent = reactive({
  id: '',
  name: '',
  gender: '',
  age: 0,
  class: '',
  email: '',
  status: '',
  enrollmentDate: '',
  remark: ''
})

// 搜索
const handleSearch = () => {
  loading.value = true
  // TODO: 调用搜索 API
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// 重置搜索
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = ''
  })
  handleSearch()
}

// 表格选择
const handleSelectionChange = (selection: any[]) => {
  selectedStudents.value = selection
}

// 查看详情
const handleView = (row: any) => {
  dialogType.value = 'view'
  Object.assign(currentStudent, row)
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/students/${row.id}`)
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除学生 ${row.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (!selectedStudents.value.length) return
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedStudents.value.length} 名学生吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // TODO: 调用批量删除 API
    ElMessage.success('批量删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量导入
const handleImport = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // 验证数据格式
      const validData = jsonData.filter((item: any) => {
        return item['学号'] && item['姓名'] && item['性别'] && item['年龄'] && item['班级']
      })

      if (validData.length === 0) {
        ElMessage.error('导入的数据格式不正确')
        return
      }

      // 转换数据格式
      const newStudents = validData.map((item: any) => ({
        id: item['学号'],
        name: item['姓名'],
        gender: item['性别'] === '男' ? 'male' : 'female',
        age: Number(item['年龄']),
        class: item['班级'],
        email: item['邮箱'] || `student${item['学号']}@example.com`,
        status: item['状态'] === '在读' ? 'active' : 'inactive',
        enrollmentDate: item['入学时间'] || '2024-09-01',
        remark: item['备注'] || ''
      }))

      // 添加到现有数据中
      allStudents.value = [...allStudents.value, ...newStudents]
      total.value = allStudents.value.length
      ElMessage.success(`成功导入 ${newStudents.length} 条数据`)
    } catch (error) {
      console.error('导入失败:', error)
      ElMessage.error('导入失败，请检查文件格式')
    }
  }
  reader.readAsArrayBuffer(file.raw)
}

// 批量导出
const handleBatchExport = () => {
  try {
    // 准备导出数据
    const exportData = selectedStudents.value.map(student => ({
      '学号': student.id,
      '姓名': student.name,
      '性别': student.gender === 'male' ? '男' : '女',
      '年龄': student.age,
      '班级': student.class,
      '邮箱': student.email,
      '状态': student.status === 'active' ? '在读' : '休学',
      '入学时间': student.enrollmentDate,
      '备注': student.remark
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    XLSX.utils.book_append_sheet(wb, ws, '学生信息')

    // 导出文件
    XLSX.writeFile(wb, `学生信息_${new Date().toLocaleDateString()}.xlsx`)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.student-list {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>