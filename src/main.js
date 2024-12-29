import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia(); // Pinia 인스턴스 생성

//main.js에 적용하면 vue 프로젝트 전체에 적용되서 사용 가능
createApp(App).use(store).use(router).use(pinia).use(ElementPlus).mount('#app')
