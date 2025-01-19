import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Импорт вашего Vuex-хранилища

const app = createApp(App);

// Передача хранилища в приложение
app.use(store);

app.mount('#app');