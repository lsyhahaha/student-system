interface MenuItem {
  path: string
  name: string
  icon: string
  children?: MenuItem[]
}

interface RoleConfig {
  menus: MenuItem[]
  permissions: string[]
}

// 定义各角色的菜单和权限配置
export const roleConfigs: Record<string, RoleConfig> = {
  admin: {
    menus: [
      { path: '/home', name: '首页', icon: 'House' },
      { path: '/students', name: '学生管理', icon: 'User' },
      { path: '/scores', name: '成绩管理', icon: 'Document' },
      { path: '/attendance', name: '考勤管理', icon: 'Calendar' },
      { path: '/system', name: '系统设置', icon: 'Setting' }
    ],
    permissions: ['student.view', 'student.edit', 'score.view', 'score.edit', 'attendance.view', 'attendance.edit', 'system.manage']
  },
  teacher: {
    menus: [
      { path: '/home', name: '首页', icon: 'House' },
      { path: '/students', name: '学生信息', icon: 'User' },
      { path: '/scores', name: '成绩录入', icon: 'Document' },
      { path: '/attendance', name: '考勤记录', icon: 'Calendar' }
    ],
    permissions: ['student.view', 'score.view', 'score.edit', 'attendance.view', 'attendance.edit']
  },
  student: {
    menus: [
      { path: '/home', name: '首页', icon: 'House' },
      { path: '/profile', name: '个人信息', icon: 'User' },
      { path: '/my-scores', name: '我的成绩', icon: 'Document' },
      { path: '/my-attendance', name: '我的考勤', icon: 'Calendar' }
    ],
    permissions: ['profile.view', 'score.view', 'attendance.view']
  }
} 