import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/zh-CN'
import quasarIconSet from 'quasar/icon-set/fontawesome-v5'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: {},  //添加Quasar插件
    lang: quasarLang,
    iconSet: quasarIconSet,
})

myApp.mount('#app')