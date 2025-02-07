import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useAuthStore } from './store/auth'
//main.js에 적용하면 vue 프로젝트 전체에 적용되서 사용 가능

// Pinia 생성
const pinia = createPinia()

// Vue 애플리케이션 초기화
const app = createApp(App)

// Pinia 초기화
app.use(store).use(router).use(pinia).use(ElementPlus)

// authStore 초기화
const authStore = useAuthStore()
authStore.initialize() // 새로고침 시 상태 복구

// Vue 애플리케이션 마운트
app.mount('#app')
