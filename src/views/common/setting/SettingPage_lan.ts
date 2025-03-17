export const settingPage_cn = {
  language: '语言',
  name: '语言名称',
  restartTip: '重启后生效',
  title: '设置',
  theme: {
    title: '主题设置',
    description: '选择您喜欢的主题外观',
    light: '浅色',
    dark: '深色'
  },
  font: {
    title: '字体设置',
    size: '字体大小',
    preview: '预览',
    previewTitle: '这是标题文本',
    previewText: '这是正文内容的预览文本。您可以通过调整滑块来改变全局字体大小。'
  },
  proxy: {
    title: '代理设置',
    description: '配置网络代理',
    enable: '启用代理',
    host: '代理主机',
    port: '代理端口',
    auth: '身份验证',
    username: '用户名',
    password: '密码',
    placeholder: {
      host: '输入代理主机地址',
      port: '输入代理端口',
      username: '输入用户名（可选）',
      password: '输入密码（可选）'
    },
    testConnection: '测试连接',
    notification: {
      saved: '代理设置已保存',
      testSuccess: '代理连接测试成功',
      testFailed: '代理连接测试失败'
    }
  },
  ai: {
    title: 'AI 设置',
    description: '配置 AI 对话接口',
    enable: '启用 AI',
    model: 'AI 模型',
    apiKey: 'API Key',
    baseUrl: '接口地址',
    temperature: '随机度',
    maxTokens: '最大长度',
    placeholder: {
      apiKey: '输入您的 API Key',
      baseUrl: '输入接口地址',
      temperature: '0-2之间,越大回答越随机',
      maxTokens: '单次回复最大字符数'
    },
    testConnection: '测试连接',
    notification: {
      saved: 'AI 设置已保存',
      testSuccess: '连接测试成功',
      testFailed: '连接测试失败'
    }
  }
}


export const settingPage_jp = {
  language: '言語',
  name: '言語名',
  restartTip: '再起動後に有効にする設定',
  title: '設定',
  theme: {
    title: 'テーマ設定',
    description: 'お好みのテーマを選択してください',
    light: 'ライト',
    dark: 'ダーク'
  },
  font: {
    title: 'フォント設定',
    size: 'フォントサイズ',
    preview: 'プレビュー',
    previewTitle: 'これはタイトルテキストです',
    previewText: 'これは本文のプレビューテキストです。スライダーを調整して、グローバルフォントサイズを変更できます。'
  },
  proxy: {
    title: 'プロキシ設定',
    description: 'ネットワークプロキシの設定',
    enable: 'プロキシを有効にする',
    host: 'プロキシホスト',
    port: 'ポート',
    auth: '認証',
    username: 'ユーザー名',
    password: 'パスワード',
    placeholder: {
      host: 'プロキシホストを入力',
      port: 'ポート番号を入力',
      username: 'ユーザー名（オプション）',
      password: 'パスワード（オプション）'
    },
    testConnection: '接続テスト',
    notification: {
      saved: 'プロキシ設定を保存しました',
      testSuccess: '接続テストに成功しました',
      testFailed: '接続テストに失敗しました'
    }
  }
}