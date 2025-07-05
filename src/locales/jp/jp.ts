import { homePage_jp } from '@/views/top/HomePage_lan'
import { headerBar_jp } from '@/components/common/HeaderBar/HeaderBar_lan'
import { jsonFormat_jp } from '@/views/service/json/JsonFormat_lan'
import { rightDrawer_jp } from '@/components/common/RightDrawer/RightDrawer_lan'
import { settingPage_jp } from '@/views/common/setting/SettingPage_lan'
import { regexFormat_jp} from '@/views/service/regex/RegexFormat_lan'
import { uuidCreat_jp } from '@/views/service/uuid/UUIDCreat_lan'
import { encodingConvert_jp } from '@/views/service/encoding/EncodingConvert_lan'
import { leftDrawer_jp } from '@/components/common/LeftDrawer/LeftDrawer_lan'
import { jwtParser_jp } from '@/views/service/jwt/JWTParser_lan'
import { aiChat_jp } from '@/views/service/ai/AIChat_lan'
import { documentation_jp } from '@/views/documentation/DocumentationPage_lan'
import { documentFormat_jp } from '@/views/service/documentFormat/DocumentFormat_lan'
import { common_jp } from '@/locales/common'
const jp = {
  homePage: homePage_jp,
  jsonFormat: jsonFormat_jp,
  headerBar: headerBar_jp,
  rightDrawer: rightDrawer_jp,
  settingPage: settingPage_jp,
  regexFormat: regexFormat_jp,
  uuidCreat: uuidCreat_jp,
  encodingConvert: encodingConvert_jp,
  leftDrawer: leftDrawer_jp,
  jwtParser: jwtParser_jp,
  aiChat: aiChat_jp,
  documentation: documentation_jp,
  documentFormat: documentFormat_jp,
  common: common_jp,
  csvGenerate: {
    title: 'CSV作成',
    templateInput: 'テンプレート入力',
    templatePlaceholder: 'CSVテンプレートを入力してください。例：\nテストヘッダー1,テストヘッダー2,テストヘッダー3\nテスト{i},テスト{i},テスト{i}',
    startValue: '開始値',
    endValue: '終了値',
    fillAll: '全て埋める',
    generate: '生成',
    result: '生成結果',
    copy: 'コピー',
    download: 'CSVダウンロード',
    needTemplate: 'テンプレートは少なくともヘッダーと1行のデータが必要です',
    copied: 'クリップボードにコピーしました'
  }
}

export default jp