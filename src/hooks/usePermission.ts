import { ref, computed } from 'vue'
import { roleConfigs } from '../config/roles'

// 模拟获取用户信息
const userInfo = ref({
  role: localStorage.getItem('userRole') || 'student',
  name: localStorage.getItem('userName') || '未登录'
})

export function usePermission() {
  // 获取当前用户角色的配置
  const currentRoleConfig = computed(() => roleConfigs[userInfo.value.role])

  // 检查是否有某个权限
  const hasPermission = (permission: string) => {
    return currentRoleConfig.value.permissions.includes(permission)
  }

  // 获取当前用户可访问的菜单
  const userMenus = computed(() => currentRoleConfig.value.menus)

  // 设置用户角色（登录时使用）
  const setUserRole = (role: string, name: string) => {
    userInfo.value.role = role
    userInfo.value.name = name
    localStorage.setItem('userRole', role)
    localStorage.setItem('userName', name)
  }

  return {
    userInfo,
    hasPermission,
    userMenus,
    setUserRole
  }
}

// 创建权限指令
export const vPermission = {
  mounted(el: HTMLElement, binding: { value: string }) {
    const { hasPermission } = usePermission()
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
} 