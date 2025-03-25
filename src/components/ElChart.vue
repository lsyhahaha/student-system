<template>
  <div ref="chartRef" :style="{ width: '100%', height: '100%' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { ECOption } from '@/types/echarts'

const props = defineProps<{
  option: ECOption
  autoresize?: boolean
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
}

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize()
}

// 监听 option 变化
watch(
  () => props.option,
  (newOption) => {
    chart?.setOption(newOption)
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  if (props.autoresize) {
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  if (props.autoresize) {
    window.removeEventListener('resize', handleResize)
  }
  chart?.dispose()
})
</script> 