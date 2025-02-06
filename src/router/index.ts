import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/top/HomePage.vue'
import JsonFormat from '@/views/service/json/JsonFormat.vue'
import SettingPage from '@/views/common/setting/SettingPage.vue'
import RegexFormat from '@/views/service/regex/RegexFormat.vue'
import UUIDCreat from '@/views/service/uuid/UUIDCreat.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/service',
    name: 'Service',
    children: [
      {
        path: 'json_format',
        name: 'JSON',
        component: JsonFormat,
      },{
        path: 'regex_format',
        name: 'regex',
        component: RegexFormat,
      },{
        path: 'uuid',
        name: 'uuid',
        component: UUIDCreat,
      }
    ],
  },
  {
    path: '/common',
    name: 'Common',
    children: [
      {
        path: 'settings',
        name: 'Settings',
        component: SettingPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
