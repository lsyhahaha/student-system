import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/students/StudentList.vue')
    },
    {
      path: '/students/add',
      name: 'add-student',
      component: () => import('../views/students/StudentForm.vue')
    },
    {
      path: '/students/:id',
      name: 'edit-student',
      component: () => import('../views/students/StudentForm.vue')
    }
  ]
})

export default router 