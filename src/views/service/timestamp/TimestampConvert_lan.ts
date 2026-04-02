export const timestampConvert_cn = {
    title: '时间戳转换器',
    description: '时间戳与日期格式互转工具',
    currentTimestamp: '当前时间戳',
    seconds: '秒',
    milliseconds: '毫秒',
    mode: {
        timestampToDate: '时间戳转日期',
        dateToTimestamp: '日期转时间戳'
    },
    input: {
        timestamp: '输入时间戳',
        placeholder: '请输入时间戳（秒或毫秒）...',
        autoDetect: '自动识别精度'
    },
    date: {
        selectDate: '选择日期时间',
        selectDatePlaceholder: '请选择日期时间...'
    },
    output: {
        title: '转换结果',
        iso8601: 'ISO 8601',
        standard: '标准格式',
        slashFormat: '斜杠格式',
        localFormat: '本地格式',
        secondTimestamp: '秒级时间戳',
        millisecondTimestamp: '毫秒级时间戳',
        weekday: '星期'
    },
    action: {
        convert: '转换',
        copy: '复制',
        paste: '粘贴',
        clear: '清除',
        now: '当前时间'
    },
    weekday: {
        sunday: '星期日',
        monday: '星期一',
        tuesday: '星期二',
        wednesday: '星期三',
        thursday: '星期四',
        friday: '星期五',
        saturday: '星期六'
    },
    notification: {
        convertSuccess: '转换成功',
        copySuccess: '复制成功',
        copyFailed: '复制失败',
        pasteFailed: '粘贴失败',
        invalidTimestamp: '无效的时间戳',
        invalidDate: '无效的日期'
    }
}

export const timestampConvert_jp = {
    title: 'タイムスタンプ変換',
    description: 'タイムスタンプと日付形式の相互変換ツール',
    currentTimestamp: '現在のタイムスタンプ',
    seconds: '秒',
    milliseconds: 'ミリ秒',
    mode: {
        timestampToDate: 'タイムスタンプ→日付',
        dateToTimestamp: '日付→タイムスタンプ'
    },
    input: {
        timestamp: 'タイムスタンプを入力',
        placeholder: 'タイムスタンプを入力（秒またはミリ秒）...',
        autoDetect: '精度を自動検出'
    },
    date: {
        selectDate: '日時を選択',
        selectDatePlaceholder: '日時を選択してください...'
    },
    output: {
        title: '変換結果',
        iso8601: 'ISO 8601',
        standard: '標準形式',
        slashFormat: 'スラッシュ形式',
        localFormat: 'ローカル形式',
        secondTimestamp: '秒単位タイムスタンプ',
        millisecondTimestamp: 'ミリ秒単位タイムスタンプ',
        weekday: '曜日'
    },
    action: {
        convert: '変換',
        copy: 'コピー',
        paste: '貼り付け',
        clear: 'クリア',
        now: '現在時刻'
    },
    weekday: {
        sunday: '日曜日',
        monday: '月曜日',
        tuesday: '火曜日',
        wednesday: '水曜日',
        thursday: '木曜日',
        friday: '金曜日',
        saturday: '土曜日'
    },
    notification: {
        convertSuccess: '変換成功',
        copySuccess: 'コピー成功',
        copyFailed: 'コピー失敗',
        pasteFailed: '貼り付け失敗',
        invalidTimestamp: '無効なタイムスタンプ',
        invalidDate: '無効な日付'
    }
}
