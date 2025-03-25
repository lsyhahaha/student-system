import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import StudentList from '../views/students/StudentList.vue'
import StudentEdit from '../views/students/StudentEdit.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/students',
      name: 'students',
      component: StudentList,
      meta: { requiresAuth: true }
    },
    {
      path: '/students/add',
      name: 'student-add',
      component: StudentEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/students/:id',
      name: 'student-edit',
      component: StudentEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/students'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/students')
  } else {
    next()
  }
})

export default router 