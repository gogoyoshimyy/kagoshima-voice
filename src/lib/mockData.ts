// Mock data for demo deployment without database
// Based on seed data from prisma/seed.ts

export type MockUser = {
    id: string
    createdAt: Date
}

export type MockIssue = {
    id: string
    title: string
    summary: string
    categories: string
    regionScope: string
    isPublic: boolean
    createdAt: Date
    posts: MockPost[]
    reactions: MockReaction[]
    follows: MockFollow[]
    solutions: MockSolution[]
    productUpdates: MockProductUpdate[]
}

export type MockPost = {
    id: string
    userId: string
    issueId: string
    textOriginal: string
    textFinal: string
    categories: string
    region: string
    status: string
    createdAt: Date
}

export type MockReaction = {
    id: string
    issueId: string
    userId: string
    type: string
    createdAt: Date
}

export type MockFollow = {
    id: string
    issueId: string
    userId: string
    createdAt: Date
}

export type MockSolution = {
    id: string
    issueId: string
    title: string
    type: string
    audience: string
    steps: string
    etaMinutes: number
    providerLabel: string
    evidenceTag: string
    url: string | null
    isPublished: boolean
    createdAt: Date
    reactions: MockSolutionReaction[]
}

export type MockSolutionReaction = {
    id: string
    solutionId: string
    userId: string
    type: string
    createdAt: Date
}

export type MockProductUpdate = {
    id: string
    issueId: string
    category: string
    title: string
    description: string
    companyName: string | null
    releaseDate: Date | null
    status: string
    type: string
    url: string | null
    isPublished: boolean
    createdAt: Date
}

export type MockNotification = {
    id: string
    userId: string
    issueId: string | null
    message: string
    isRead: boolean
    createdAt: Date
}

// Sample users
export const MOCK_USERS: MockUser[] = [
    { id: 'user-001', createdAt: new Date('2024-01-01') },
    { id: 'user-002', createdAt: new Date('2024-01-02') },
    { id: 'user-003', createdAt: new Date('2024-01-03') },
]

// Sample issues with all related data
export const MOCK_ISSUES: MockIssue[] = [
    {
        id: 'issue-001',
        title: '市役所手続きが分かりづらい',
        summary: '転入届や各種手続きの必要書類が分かりにくい。何を持っていけばいいのか事前に確認したい。',
        categories: JSON.stringify(['行政']),
        regionScope: '鹿児島市',
        isPublic: true,
        createdAt: new Date('2024-01-10'),
        posts: [],
        reactions: [],
        follows: [],
        solutions: [],
        productUpdates: []
    },
    {
        id: 'issue-002',
        title: '学生のメンタル相談の入口が分からない',
        summary: '大学生が悩みを相談したい時、どこに行けば良いか分からない。カウンセリングのハードルが高い。',
        categories: JSON.stringify(['メンタル']),
        regionScope: '鹿児島市',
        isPublic: true,
        createdAt: new Date('2024-01-11'),
        posts: [],
        reactions: [],
        follows: [],
        solutions: [],
        productUpdates: []
    },
    {
        id: 'issue-003',
        title: 'バスの乗り継ぎが難しい',
        summary: '複数の路線を使う場合、乗り継ぎのタイミングや場所が分かりにくい。学割や定期の説明も欲しい。',
        categories: JSON.stringify(['交通']),
        regionScope: '鹿児島市',
        isPublic: true,
        createdAt: new Date('2024-01-12'),
        posts: [],
        reactions: [],
        follows: [],
        solutions: [],
        productUpdates: []
    },
    {
        id: 'issue-004',
        title: '黒豚を使った冷凍餃子が欲しい',
        summary: '鹿児島の黒豚を使った手軽な冷凍餃子が市内のスーパーにほとんど売っていない。ご当地商品として開発してほしい。',
        categories: JSON.stringify(['商品要望']),
        regionScope: '鹿児島市',
        createdAt: new Date('2024-01-13'),
        isPublic: true,
        posts: [],
        reactions: [],
        follows: [],
        solutions: [],
        productUpdates: []
    },
    {
        id: 'issue-005',
        title: '子ども向け室内遊び場が少ない',
        summary: '雨の日に子どもを遊ばせる場所が限られています。ショッピングモール内などに室内遊び場があると嬉しいです。',
        categories: JSON.stringify(['子育て']),
        regionScope: '霧島市',
        isPublic: true,
        createdAt: new Date('2024-01-14'),
        posts: [],
        reactions: [],
        follows: [],
        solutions: [],
        productUpdates: []
    },
]

// Solutions for issues
const SOLUTIONS_ISSUE_001: MockSolution[] = [
    {
        id: 'sol-001',
        issueId: 'issue-001',
        title: '転入の持ち物3点チェック',
        type: 'checklist',
        audience: JSON.stringify(['転入予定者', '引越し準備中']),
        steps: JSON.stringify([
            'マイナンバーカード（または通知カード）を用意',
            '前住所の転出証明書を取得',
            '本人確認書類（免許証等）を準備'
        ]),
        etaMinutes: 5,
        providerLabel: '公式(行政)',
        evidenceTag: '公式情報',
        url: 'https://www.city.kagoshima.lg.jp/shimin/kurashi/todokede/index.html',
        isPublished: true,
        createdAt: new Date('2024-01-15'),
        reactions: []
    },
    {
        id: 'sol-002',
        issueId: 'issue-001',
        title: '手続きナビ（簡易診断）',
        type: 'tool',
        audience: JSON.stringify(['市役所利用者']),
        steps: JSON.stringify([
            'どんな手続きが必要か質問に答える',
            '必要書類のリストが表示される',
            'リストを保存して窓口に持参'
        ]),
        etaMinutes: 3,
        providerLabel: '編集部',
        evidenceTag: '参考情報',
        url: null,
        isPublished: true,
        createdAt: new Date('2024-01-16'),
        reactions: []
    }
]

const SOLUTIONS_ISSUE_002: MockSolution[] = [
    {
        id: 'sol-003',
        issueId: 'issue-002',
        title: '相談先の選び方 3ステップ',
        type: 'info',
        audience: JSON.stringify(['高校生', '大学生']),
        steps: JSON.stringify([
            '緊急度を確認（命に関わる場合は警察・救急へ）',
            '学内カウンセラー or 学外専門機関を選択',
            '予約方法を確認してアクセス'
        ]),
        etaMinutes: 5,
        providerLabel: '大学',
        evidenceTag: '参考情報',
        url: 'https://example.com/mental-support',
        isPublished: true,
        createdAt: new Date('2024-01-17'),
        reactions: []
    },
    {
        id: 'sol-004',
        issueId: 'issue-002',
        title: '気持ち整理ミニシート',
        type: 'tool',
        audience: JSON.stringify(['悩みを整理したい人']),
        steps: JSON.stringify([
            '今の気持ちを3つのキーワードで書く',
            'それぞれの背景を1行で説明',
            '誰かに伝えるかを決める'
        ]),
        etaMinutes: 3,
        providerLabel: '編集部',
        evidenceTag: '検証済(予定)',
        url: null,
        isPublished: true,
        createdAt: new Date('2024-01-18'),
        reactions: []
    }
]

const SOLUTIONS_ISSUE_003: MockSolution[] = [
    {
        id: 'sol-005',
        issueId: 'issue-003',
        title: '乗り継ぎの確認テンプレ',
        type: 'checklist',
        audience: JSON.stringify(['バス利用者', '通学・通勤者']),
        steps: JSON.stringify([
            '出発地と目的地の最寄りバス停を確認',
            '乗り換え案内アプリで所要時間を検索',
            '乗り場番号と系統を事前にメモ'
        ]),
        etaMinutes: 5,
        providerLabel: '企業',
        evidenceTag: '参考情報',
        url: 'https://example.com/bus-guide',
        isPublished: true,
        createdAt: new Date('2024-01-19'),
        reactions: []
    },
    {
        id: 'sol-006',
        issueId: 'issue-003',
        title: '定期券・学割 比較ツール',
        type: 'tool',
        audience: JSON.stringify(['学生', '通勤者']),
        steps: JSON.stringify([
            '利用区間と頻度を入力',
            'ICカード vs 定期券の料金を比較',
            '最適プランを確認して購入へ'
        ]),
        etaMinutes: 3,
        providerLabel: '編集部',
        evidenceTag: '検証済(予定)',
        url: null,
        isPublished: true,
        createdAt: new Date('2024-01-20'),
        reactions: []
    }
]

// Assign solutions to issues
MOCK_ISSUES[0].solutions = SOLUTIONS_ISSUE_001
MOCK_ISSUES[1].solutions = SOLUTIONS_ISSUE_002
MOCK_ISSUES[2].solutions = SOLUTIONS_ISSUE_003

// Sample reactions
export const MOCK_REACTIONS: MockReaction[] = [
    { id: 'reaction-001', issueId: 'issue-001', userId: 'user-001', type: 'LIKE', createdAt: new Date('2024-01-20') },
    { id: 'reaction-002', issueId: 'issue-001', userId: 'user-002', type: 'EMERGENCY', createdAt: new Date('2024-01-21') },
    { id: 'reaction-003', issueId: 'issue-002', userId: 'user-001', type: 'LIKE', createdAt: new Date('2024-01-22') },
]

// Assign reactions to issues
MOCK_ISSUES[0].reactions = MOCK_REACTIONS.filter(r => r.issueId === 'issue-001')
MOCK_ISSUES[1].reactions = MOCK_REACTIONS.filter(r => r.issueId === 'issue-002')

// Sample follows
export const MOCK_FOLLOWS: MockFollow[] = [
    { id: 'follow-001', issueId: 'issue-001', userId: 'user-001', createdAt: new Date('2024-01-20') },
    { id: 'follow-002', issueId: 'issue-002', userId: 'user-001', createdAt: new Date('2024-01-21') },
]

// Assign follows to issues
MOCK_ISSUES[0].follows = MOCK_FOLLOWS.filter(f => f.issueId === 'issue-001')
MOCK_ISSUES[1].follows = MOCK_FOLLOWS.filter(f => f.issueId === 'issue-002')

// Sample posts
export const MOCK_POSTS: MockPost[] = [
    {
        id: 'post-001',
        userId: 'user-001',
        issueId: 'issue-001',
        textOriginal: '転入手続きで必要な書類を知りたい',
        textFinal: '転入手続きで必要な書類を知りたいです。',
        categories: JSON.stringify(['行政']),
        region: '鹿児島市',
        status: 'APPROVED',
        createdAt: new Date('2024-01-10')
    }
]

// Assign posts to issues
MOCK_ISSUES[0].posts = MOCK_POSTS.filter(p => p.issueId === 'issue-001')

// Sample product updates
export const MOCK_PRODUCT_UPDATES: MockProductUpdate[] = [
    {
        id: 'update-001',
        issueId: 'issue-004',
        category: '商品',
        title: '鹿児島黒豚餃子 新発売',
        description: '地元スーパーと協力して、黒豚100%使用の冷凍餃子を開発中です。',
        companyName: '地元食品メーカー',
        releaseDate: new Date('2024-06-01'),
        status: '開発中',
        type: 'product',
        url: null,
        isPublished: true,
        createdAt: new Date('2024-02-01')
    }
]

// Assign product updates to issues
MOCK_ISSUES[3].productUpdates = MOCK_PRODUCT_UPDATES.filter(u => u.issueId === 'issue-004')

// Helper function to get issue by ID
export function getMockIssueById(id: string): MockIssue | undefined {
    return MOCK_ISSUES.find(issue => issue.id === id)
}

// Helper function to get counts
export function getMockIssueCounts(issueId: string) {
    const issue = getMockIssueById(issueId)
    if (!issue) return { posts: 0, reactions: 0, follows: 0 }

    return {
        posts: issue.posts.length,
        reactions: issue.reactions.length,
        follows: issue.follows.length
    }
}
