import { createRouter, createWebHistory } from 'vue-router'
import { usePermission } from '../hooks/usePermission'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

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
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/students/StudentList.vue'),
      meta: { requiresAuth: true, permission: 'student.view' }
    },
    {
      path: '/scores',
      name: 'scores',
      component: () => import('../views/scores/ScoreList.vue'),
      meta: { requiresAuth: true, permission: 'score.view' }
    },
    {
      path: '/attendance',
      name: 'attendance',
      component: () => import('../views/attendance/AttendanceList.vue'),
      meta: { requiresAuth: true, permission: 'attendance.view' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true, permission: 'profile.view' }
    },
    {
      path: '/my-scores',
      name: 'my-scores',
      component: () => import('../views/students/MyScores.vue'),
      meta: { requiresAuth: true, permission: 'score.view' }
    },
    {
      path: '/my-attendance',
      name: 'my-attendance',
      component: () => import('../views/students/MyAttendance.vue'),
      meta: { requiresAuth: true, permission: 'attendance.view' }
    },
    {
      path: '/system',
      name: 'system',
      component: () => import('../views/system/Settings.vue'),
      meta: { requiresAuth: true, permission: 'system.manage' }
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const { hasPermission } = usePermission()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.permission && !hasPermission(to.meta.permission as string)) {
    next('/home')  // 如果没有权限，跳转到首页
  } else if (to.path === '/login' && isAuthenticated) {
    next('/home')
  } else {
    next()
  }
})

export default router 