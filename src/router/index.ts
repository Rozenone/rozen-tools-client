import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/top/HomePage.vue') 
    },
    {
      path: '/common',
      children: [
        {
          path: 'settings',
          component: () => import('@/views/common/setting/SettingPage.vue')
        }
      ]
    },
    {
      path: '/service',
      children: [
        {
          path: 'json_format',
          component: () => import('@/views/service/json/JsonFormat.vue')
        },
        {
          path: 'regex_format',
          component: () => import('@/views/service/regex/RegexFormat.vue')
        },
        {
          path: 'uuid',
          component: () => import('@/views/service/uuid/UUIDCreat.vue')
        },
        {
          path: 'encoding',
          component: () => import('@/views/service/encoding/EncodingConvert.vue')
        }
      ]
    }
  ]
})

export default router

