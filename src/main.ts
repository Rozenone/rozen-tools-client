import { createApp } from 'vue';
import { Quasar, Dark } from 'quasar';
import { createPinia } from 'pinia';
import quasarLang from 'quasar/lang/zh-CN';
import '@quasar/extras/material-icons/material-icons.css';
import '@/assets/css/base.css'
import 'quasar/dist/quasar.css';
import i18n from './locales/i18config'; // 直接引入 i18n 实例
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';

const myApp = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
myApp.use(i18n); // 使用 i18n 实例
myApp.use(pinia); 
myApp.use(Quasar, {
    plugins: { Dark },
    config: {
        brand: {
            primary: '#1976D2',
            secondary: '#26A69A',
            accent: '#9C27B0',
            positive: '#21BA45',
            negative: '#C10015',
            info: '#31CCEC',
            warning: '#F2C037'
        },
        dark: false
    },
});
myApp.use(router);
myApp.mount('#app');