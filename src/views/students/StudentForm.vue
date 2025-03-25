<template>
  <div class="student-form">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">{{ isEdit ? '编辑学生' : '添加学生' }}</h2>
          <el-button @click="$router.back()">返回</el-button>
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
        
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isEdit = ref(false)

const form = reactive({
  id: '',
  name: '',
  gender: 'male',
  age: 18,
  class: '',
  email: '',
  remark: ''
})

const rules = reactive<FormRules>({
  id: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{7}$/, message: '学号必须为7位数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' }
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
  ]
})

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    // TODO: 调用获取学生详情 API
    // 模拟数据
    Object.assign(form, {
      id: '2024001',
      name: '张三',
      gender: 'male',
      age: 20,
      class: '计算机科学1班',
      email: 'zhangsan@example.com',
      remark: '这是一条备注信息'
    })
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: 调用保存 API
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    router.push('/students')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.student-form {
  padding: 20px;
}
</style>