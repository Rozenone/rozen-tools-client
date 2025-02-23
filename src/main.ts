import { createApp } from "vue";
import { Quasar, Dialog, Notify } from "quasar";
import { createPinia } from "pinia";
import quasarLang from "quasar/lang/zh-CN";
import "@quasar/extras/material-icons/material-icons.css";
import "@/assets/css/base.css";
import "quasar/dist/quasar.css";
import i18n from "./locales/i18config"; // 直接引入 i18n 实例
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import '@fortawesome/fontawesome-free/css/all.min.css'

const myApp = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
myApp.use(i18n); // 使用 i18n 实例
myApp.use(pinia);
myApp.use(Quasar, {
  plugins: { Dialog, Notify }, // 添加 Quasar 插件
  lang: quasarLang,
});
myApp.use(router);
myApp.mount("#app");
