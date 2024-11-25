import { createI18n } from 'vue-i18n';
import cn from '@/locales/cn/cn'
import jp from '@/locales/jp/jp'

const messages = {
  cn,
  jp
};

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  globalInjection: true, // 注入全局属性和函数
  silentTranslationWarn: true, // 抑制本地化失败警告
  silentFallbackWarn: true, // 抑制回退失败警告
  locale: localStorage.getItem('lan'),
  fallbackLocale: 'jp',
  messages, // 添加消息对象
});

export default i18n; // 直接导出 i18n 实例