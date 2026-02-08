export const CATEGORIES = [
    '生活', '交通', '子育て', '医療', '仕事', '教育', '防災',
    '観光', '行政', 'メンタル', '人間関係', '物価',
    '商品要望', 'サービス要望', 'アプリ機能', 'イベント企画',
    'その他'
]

export const REGIONS = [
    '鹿児島市', '霧島市', '姶良市', '薩摩川内市', '鹿屋市', '指宿市', '奄美市', 'その他'
]

export const TOXIC_WORDS: Record<string, string> = {
    'idiot': 'person with different view',
    'stupid': 'unwise',
    'hate': 'dislike',
    'kill': 'eliminate',
    'ugly': 'visually challenging',
    // Add Japanese examples as requested
    '無能': '勉強不足',
    '最悪': '改善の余地がある',
    '死ね': 'よくない',
    '馬鹿': '知識不足',
    'ウザい': '気になる',
    '老害': '年配の方',
}
