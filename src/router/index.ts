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
      path: '/documentation',
      component: () => import('@/views/documentation/DocumentationPage.vue')
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
        },
        {
          path: 'jwt',
          component: () => import('@/views/service/jwt/JWTParser.vue')
        },
        {
          path: 'ai-chat',
          component: () => import('@/views/service/ai/AIChat.vue')
        },
        {
          path: 'document-format',
          component: () => import('@/views/service/documentFormat/DocumentFormat.vue')
        },
        {
          path: 'csv/generate',
          name: 'CsvGenerate',
          component: () => import('@/views/service/csv/CsvGenerate.vue'),
          meta: { title: 'CSV做成', icon: 'table_chart' }
        },
        {
          path: 'plsql/to-plantuml',
          name: 'PlsqlToPlantUml',
          component: () => import('@/views/service/plsql/PlsqlToPlantUml.vue'),
          meta: { title: 'PLSQL转流程图', icon: 'description' }
        }
      ]
    },
    {
      path: '/search',
      component: () => import('@/views/searchPage/SearchPage.vue')
    },
    {
      path: '/service/common-file-search',
      component: () => import('@/views/service/CommonFileSearch/CommonFileSearch.vue')
    }
  ]
})

export default router

