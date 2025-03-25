<template>
  <div class="home">
    <div class="welcome-container">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎使用学生管理系统</h1>
        <p class="welcome-subtitle">{{ getGreeting() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 问候语
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，注意休息'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/img/unnamed.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  position: relative;
}

.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
}

.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.welcome-content {
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  animation: fadeInDown 1s ease-out;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 2rem;
  color: #34495e;
  animation: fadeInUp 1s ease-out 0.5s both;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.illustration-container {
  width: 100%;
  max-width: 400px;
  animation: float 6s ease-in-out infinite;
}

.welcome-image {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style> 