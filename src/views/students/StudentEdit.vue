<template>
  <div class="student-edit">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">{{ isEdit ? '编辑学生' : '添加学生' }}</h2>
          <el-button @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>返回
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="max-w-2xl mx-auto"
      >
        <el-form-item label="学号" prop="id">
          <el-input v-model="form.id" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="100" />
        </el-form-item>

        <el-form-item label="班级" prop="class">
          <el-select v-model="form.class" placeholder="请选择班级">
            <el-option label="计算机科学1班" value="计算机科学1班" />
            <el-option label="计算机科学2班" value="计算机科学2班" />
            <el-option label="软件工程1班" value="软件工程1班" />
            <el-option label="软件工程2班" value="软件工程2班" />
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">在读</el-radio>
            <el-radio label="inactive">休学</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="入学时间" prop="enrollmentDate">
          <el-date-picker
            v-model="form.enrollmentDate"
            type="date"
            placeholder="选择入学时间"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存
          </el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const isEdit = computed(() => route.params.id !== undefined)

// 表单数据
const form = reactive({
  id: '',
  name: '',
  gender: 'male',
  age: 18,
  class: '',
  email: '',
  status: 'active',
  enrollmentDate: '',
  remark: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  id: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{7}$/, message: '学号必须为7位数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度应在 2 到 20 个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  class: [
    { required: true, message: '请选择班级', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  enrollmentDate: [
    { required: true, message: '请选择入学时间', trigger: 'change' }
  ]
})

// 如果是编辑模式，获取学生信息
if (isEdit.value) {
  // TODO: 调用获取学生信息 API
  Object.assign(form, {
    id: route.params.id,
    name: '张三',
    gender: 'male',
    age: 20,
    class: '计算机科学1班',
    email: 'zhangsan@example.com',
    status: 'active',
    enrollmentDate: '2024-09-01',
    remark: '这是一条备注信息'
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // TODO: 调用保存 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    router.push('/students')
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.student-edit {
  padding: 20px;
}
</style> 