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
          path: 'document-format',
          component: () => import('@/views/service/documentFormat/DocumentFormat.vue')
        },
        {
          path: 'csv/generate',
          component: () => import('@/views/service/csv/CsvGenerate.vue')
        },
        {
          path: 'folder-tree',
          component: () => import('@/views/service/folderTree/FolderTree.vue')
        },
        {
          path: 'base64-parse',
          component: () => import('@/views/service/base64/Base64Parse.vue')
        },
        {
          path: 'xml-format',
          component: () => import('@/views/service/xml/XmlFormat.vue')
        },
        {
          path: 'crypto-hash',
          component: () => import('@/views/service/crypto/CryptoHash.vue')
        },
        {
          path: 'url-encode',
          component: () => import('@/views/service/url/UrlEncode.vue')
        },
        {
          path: 'lang-detect',
          component: () => import('@/views/service/langDetect/LangDetect.vue')
        },
        {
          path: 'unicode-trans',
          component: () => import('@/views/service/unicode/UnicodeTrans.vue')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('@/views/searchPage/SearchPage.vue')
    },
    {
      path: '/favorites',
      component: () => import('@/views/favorites/FavoritesPage.vue')
    },
    {
      path: '/service/common-file-search',
      component: () => import('@/views/service/CommonFileSearch/CommonFileSearch.vue')
    }
  ]
})

export default router

