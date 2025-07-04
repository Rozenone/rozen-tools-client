export const jwtParser_cn = {
  title: 'JWT 解析器',
  description: '解析和生成 JSON Web Token',
  input: 'JWT Token',
  placeholder: '请输入JWT Token...',
  decode: '解析',
  header: 'Header',
  payload: 'Payload',
  signature: 'Signature',
  verify: '验证',
  copy: '复制',
  paste: '粘贴',
  clear: '清除',
  mode: {
    decode: '解析模式',
    encode: '编码模式'
  },
  encode: {
    settings: '编码设置',
    algorithm: '算法',
    secret: '密钥',
    generate: '生成JWT',
    generatedToken: '生成的Token',
    headerPlaceholder: '请输入Header JSON...',
    payloadPlaceholder: '请输入Payload JSON...'
  },
  verification: {
    title: 'Token验证',
    algorithm: '算法',
    expiration: '过期状态',
    expired: '已过期',
    valid: '有效',
    secretKey: '密钥',
    verify: '验证签名',
    clear: '清除',
    success: '验证成功',
    failed: '验证失败',
    signatureValid: '签名验证通过',
    signatureInvalid: '签名验证失败',
    verificationFailed: '验证过程出错'
  },
  notification: {
    invalidToken: '无效的JWT Token',
    invalidJson: '无效的JSON格式',
    pasteFailed: '粘贴失败',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    decodeSuccess: '解析成功',
    generateSuccess: '生成成功'
  }
}

export const jwtParser_jp = {
  title: 'JWT パーサー',
  description: 'JSON Web Tokenの解析と生成',
  input: 'JWT Token',
  placeholder: 'JWT Tokenを入力してください...',
  decode: '解析',
  header: 'ヘッダー',
  payload: 'ペイロード',
  signature: '署名',
  verify: '検証',
  copy: 'コピー',
  paste: '貼り付け',
  clear: 'クリア',
  mode: {
    decode: '解析モード',
    encode: 'エンコードモード'
  },
  encode: {
    settings: 'エンコード設定',
    algorithm: 'アルゴリズム',
    secret: 'シークレット',
    generate: 'JWT生成',
    generatedToken: '生成されたToken',
    headerPlaceholder: 'ヘッダーJSONを入力してください...',
    payloadPlaceholder: 'ペイロードJSONを入力してください...'
  },
  verification: {
    title: 'Token検証',
    algorithm: 'アルゴリズム',
    expiration: '有効期限',
    expired: '期限切れ',
    valid: '有効',
    secretKey: 'シークレットキー',
    verify: '署名検証',
    clear: 'クリア',
    success: '検証成功',
    failed: '検証失敗',
    signatureValid: '署名検証成功',
    signatureInvalid: '署名検証失敗',
    verificationFailed: '検証エラー'
  },
  notification: {
    invalidToken: '無効なJWT Token',
    invalidJson: '無効なJSON形式',
    pasteFailed: '貼り付け失敗',
    copySuccess: 'コピー成功',
    copyFailed: 'コピー失敗',
    decodeSuccess: '解析成功',
    generateSuccess: '生成成功'
  }
} 