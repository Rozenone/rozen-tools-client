export const unicodeTrans_cn = {
    title: 'Unicode 转码',
    description: 'ASCII/Unicode/中文互相转换工具',
    inputText: '输入文本',
    inputUnicode: '输入 Unicode 转义',
    inputAscii: '输入 ASCII 码',
    outputText: '输出文本',
    outputUnicode: '输出 Unicode 转义',
    outputAscii: '输出 ASCII 码',
    convert: '转换',
    copy: '复制',
    paste: '粘贴',
    clear: '清除',
    clearOutput: '清除输出',
    mode: {
        textToUnicode: '中文/文本 -> Unicode 转义',
        unicodeToText: 'Unicode 转义 -> 中文/文本',
        textToAscii: '文本 -> ASCII 码',
        asciiToText: 'ASCII 码 -> 文本'
    },
    placeholder: {
        textToUnicode: '请输入要转换的中文或文本...',
        unicodeToText: '请输入 Unicode 转义字符串，如 \\u4f60\\u597d...',
        textToAscii: '请输入要转换的文本...',
        asciiToText: '请输入 ASCII 码，用空格分隔，如 65 66 67...',
        output: '结果将显示在这里...'
    },
    notification: {
        convertSuccess: '转换成功',
        pasteFailed: '粘贴失败',
        copySuccess: '复制成功',
        copyFailed: '复制失败',
        invalidInput: '无效的输入'
    }
}

export const unicodeTrans_jp = {
    title: 'Unicode 変換',
    description: 'ASCII/Unicode/中国語相互変換ツール',
    inputText: '入力テキスト',
    inputUnicode: '入力 Unicode エスケープ',
    inputAscii: '入力 ASCII コード',
    outputText: '出力テキスト',
    outputUnicode: '出力 Unicode エスケープ',
    outputAscii: '出力 ASCII コード',
    convert: '変換',
    copy: 'コピー',
    paste: '貼り付け',
    clear: 'クリア',
    clearOutput: '出力をクリア',
    mode: {
        textToUnicode: '中国語/テキスト -> Unicode エスケープ',
        unicodeToText: 'Unicode エスケープ -> 中国語/テキスト',
        textToAscii: 'テキスト -> ASCII コード',
        asciiToText: 'ASCII コード -> テキスト'
    },
    placeholder: {
        textToUnicode: '変換する中国語またはテキストを入力してください...',
        unicodeToText: 'Unicode エスケープ文字列を入力してください（例：\\u4f60\\u597d）...',
        textToAscii: '変換するテキストを入力してください...',
        asciiToText: 'ASCII コードを入力してください（スペース区切り、例：65 66 67）...',
        output: '結果がここに表示されます...'
    },
    notification: {
        convertSuccess: '変換成功',
        pasteFailed: '貼り付け失敗',
        copySuccess: 'コピー成功',
        copyFailed: 'コピー失敗',
        invalidInput: '無効な入力'
    }
}
