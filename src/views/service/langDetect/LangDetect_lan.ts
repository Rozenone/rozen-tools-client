export const langDetect_cn = {
    title: '代码语言检测',
    description: '检测代码中是否包含指定语言字符',
    inputCode: '输入代码',
    paste: '粘贴',
    clear: '清空',
    selectLanguages: '选择要检测的语言',
    detect: '检测',
    results: '检测结果',
    uniqueChars: '匹配字符',
    positions: '位置信息',
    line: '行',
    col: '列',
    andMore: '等 {count} 处',
    noResults: '未检测到选定的语言字符',
    languages: {
        chinese: '中文',
        japanese: '日文假名',
        korean: '韩文',
        fullwidth: '全角字符',
        cyrillic: '西里尔文/俄文'
    },
    placeholder: {
        input: '请输入或粘贴要检测的代码...'
    },
    notification: {
        detectSuccess: '检测完成，发现 {count} 种语言字符',
        noMatch: '未找到匹配的语言字符',
        pasteFailed: '粘贴失败'
    }
}

export const langDetect_jp = {
    title: 'コード言語検出',
    description: 'コード内の指定言語文字を検出',
    inputCode: 'コード入力',
    paste: '貼り付け',
    clear: 'クリア',
    selectLanguages: '検出する言語を選択',
    detect: '検出',
    results: '検出結果',
    uniqueChars: '一致文字',
    positions: '位置情報',
    line: '行',
    col: '列',
    andMore: '他 {count} 箇所',
    noResults: '選択した言語文字は検出されませんでした',
    languages: {
        chinese: '中国語',
        japanese: '日本語仮名',
        korean: '韓国語',
        fullwidth: '全角文字',
        cyrillic: 'キリル文字/ロシア語'
    },
    placeholder: {
        input: '検出するコードを入力または貼り付けてください...'
    },
    notification: {
        detectSuccess: '検出完了、{count} 種類の言語文字が見つかりました',
        noMatch: '一致する言語文字が見つかりません',
        pasteFailed: '貼り付け失敗'
    }
}
