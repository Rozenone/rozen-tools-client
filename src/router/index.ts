import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../views/top/HomePage.vue";
import JsonFormat from '../views/service/JsonFormat.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/json_format",
    name: "JSON",
    component: JsonFormat
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
