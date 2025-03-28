import { createApp } from 'vue';
import router from './router';
import HomeView from './views/HomeView.vue';

createApp(HomeView).use(router).mount('#app');