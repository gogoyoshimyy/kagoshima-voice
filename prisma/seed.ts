import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

const CATEGORIES = [
  '生活', '交通', '子育て', '医療', '仕事', '教育', '防災',
  '観光', '行政', 'メンタル', '人間関係', '物価',
  '商品要望', 'サービス要望', 'アプリ機能', 'イベント企画',
  'その他'
]

const REGIONS = [
  '鹿児島市', '霧島市', '姶良市', '薩摩川内市', '鹿屋市', '指宿市', '奄美市', 'その他'
]

const REACTION_TYPES = ['LIKE', 'EMERGENCY', 'TESTER', 'SOLVED']
const SOLUTION_REACTION_TYPES = ['HELPFUL', 'WILL_TRY', 'SOLVED', 'SAVED']

// Realistic sample issues in Japanese
const SAMPLE_ISSUES = [
  { category: '行政', region: '鹿児島市', title: '市役所手続きが分かりづらい', summary: '転入届や各種手続きの必要書類が分かりにくい。何を持っていけばいいのか事前に確認したい。' },
  { category: 'メンタル', region: '鹿児島市', title: '学生のメンタル相談の入口が分からない', summary: '大学生が悩みを相談したい時、どこに行けば良いか分からない。カウンセリングのハードルが高い。' },
  { category: '交通', region: '鹿児島市', title: 'バスの乗り継ぎが難しい', summary: '複数の路線を使う場合、乗り継ぎのタイミングや場所が分かりにくい。学割や定期の説明も欲しい。' },
  { category: '商品要望', region: '鹿児島市', title: '黒豚を使った冷凍餃子が欲しい', summary: '鹿児島の黒豚を使った手軽な冷凍餃子が市内のスーパーにほとんど売っていない。ご当地商品として開発してほしい。' },
  { category: '子育て', region: '霧島市', title: '子ども向け室内遊び場が少ない', summary: '雨の日に子どもを遊ばせる場所が限られています。ショッピングモール内などに室内遊び場があると嬉しいです。' },
]

// Solution card examples mapped to issues
const SOLUTION_TEMPLATES = [
  // Issue 0: 市役所手続き
  [
    {
      title: '転入の持ち物3点チェック',
      type: 'checklist',
      audience: ['転入予定者', '引越し準備中'],
      steps: [
        'マイナンバーカード（または通知カード）を用意',
        '前住所の転出証明書を取得',
        '本人確認書類（免許証等）を準備'
      ],
      etaMinutes: 5,
      providerLabel: '公式(行政)',
      evidenceTag: '公式情報',
      url: 'https://www.city.kagoshima.lg.jp/shimin/kurashi/todokede/index.html'
    },
    {
      title: '手続きナビ（簡易診断）',
      type: 'tool',
      audience: ['市役所利用者'],
      steps: [
        'どんな手続きが必要か質問に答える',
        '必要書類のリストが表示される',
        'リストを保存して窓口に持参'
      ],
      etaMinutes: 3,
      providerLabel: '編集部',
      evidenceTag: '参考情報',
      url: null
    }
  ],
  // Issue 1: メンタル相談
  [
    {
      title: '相談先の選び方 3ステップ',
      type: 'info',
      audience: ['高校生', '大学生'],
      steps: [
        '緊急度を確認（命に関わる場合は警察・救急へ）',
        '学内カウンセラー or 学外専門機関を選択',
        '予約方法を確認してアクセス'
      ],
      etaMinutes: 5,
      providerLabel: '大学',
      evidenceTag: '参考情報',
      url: 'https://example.com/mental-support'
    },
    {
      title: '気持ち整理ミニシート',
      type: 'tool',
      audience: ['悩みを整理したい人'],
      steps: [
        '今の気持ちを3つのキーワードで書く',
        'それぞれの背景を1行で説明',
        '誰かに伝えるかを決める'
      ],
      etaMinutes: 3,
      providerLabel: '編集部',
      evidenceTag: '検証済(予定)',
      url: null
    }
  ],
  // Issue 2: バス乗り継ぎ
  [
    {
      title: '乗り継ぎの確認テンプレ',
      type: 'checklist',
      audience: ['バス利用者', '通学・通勤者'],
      steps: [
        '出発地と目的地の最寄りバス停を確認',
        '乗り換え場所と所要時間を調べる',
        '運賃と支払い方法をチェック'
      ],
      etaMinutes: 5,
      providerLabel: '編集部',
      evidenceTag: '参考情報',
      url: null
    },
    {
      title: '学割/定期の確認ポイント',
      type: 'info',
      audience: ['学生'],
      steps: [
        '学生証を準備して窓口へ',
        '通学区間を正確に伝える',
        '購入後は定期券の有効期限を確認'
      ],
      etaMinutes: 3,
      providerLabel: '企業',
      evidenceTag: '参考情報',
      url: 'https://example.com/bus-pass'
    }
  ]
]

async function main() {
  console.log('Start seeding ...')

  // Create Users
  const users = []
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {},
    })
    users.push(user)
  }

  // Create IssueCards from sample data
  const issues = []
  for (const sample of SAMPLE_ISSUES) {
    const issue = await prisma.issueCard.create({
      data: {
        title: sample.title,
        summary: sample.summary,
        categories: JSON.stringify([sample.category]),
        regionScope: sample.region,
        isPublic: true,
      },
    })
    issues.push(issue)
  }

  // Create Posts for each Issue (3-8 posts per issue)
  for (const issue of issues) {
    const postCount = Math.floor(Math.random() * 6) + 3
    for (let j = 0; j < postCount; j++) {
      const user = users[Math.floor(Math.random() * users.length)]
      await prisma.post.create({
        data: {
          userId: user.id,
          issueId: issue.id,
          textOriginal: `${issue.summary.slice(0, 50)}に関する声 ${j + 1}`,
          textFinal: `${issue.summary.slice(0, 50)}に関する前向きな提案 ${j + 1}`,
          categories: issue.categories,
          region: issue.regionScope,
          status: 'APPROVED',
        },
      })
    }
  }

  // Create Reactions
  for (const issue of issues) {
    const reactionCount = Math.floor(Math.random() * users.length) + 3
    for (let i = 0; i < reactionCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const type = REACTION_TYPES[Math.floor(Math.random() * REACTION_TYPES.length)]
      await prisma.reaction.create({
        data: {
          issueId: issue.id,
          userId: user.id,
          type: type,
        },
      }).catch(() => { }) // Ignore duplicates
    }
  }

  // Create Follows
  for (const issue of issues) {
    const followCount = Math.floor(Math.random() * 5) + 1
    for (let i = 0; i < followCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      await prisma.follow.create({
        data: {
          issueId: issue.id,
          userId: user.id
        }
      }).catch(() => { })
    }
  }

  // Create Solutions
  console.log('Creating solutions...')
  for (let i = 0; i < Math.min(3, issues.length, SOLUTION_TEMPLATES.length); i++) {
    const issue = issues[i]
    const templates = SOLUTION_TEMPLATES[i]

    for (const template of templates) {
      const solution = await prisma.solution.create({
        data: {
          issueId: issue.id,
          title: template.title,
          type: template.type,
          audience: JSON.stringify(template.audience),
          steps: JSON.stringify(template.steps),
          etaMinutes: template.etaMinutes,
          providerLabel: template.providerLabel,
          evidenceTag: template.evidenceTag,
          url: template.url,
          isPublished: true,
        }
      })

      // Create Solution Reactions
      const reactionCount = Math.floor(Math.random() * 8) + 3
      for (let j = 0; j < reactionCount; j++) {
        const user = users[Math.floor(Math.random() * users.length)]
        const type = SOLUTION_REACTION_TYPES[Math.floor(Math.random() * SOLUTION_REACTION_TYPES.length)]
        await prisma.solutionReaction.create({
          data: {
            solutionId: solution.id,
            userId: user.id,
            type
          }
        }).catch(() => { }) // Ignore duplicates
      }
    }
  }

  console.log('Seeding finished. Created:')
  console.log(`- ${users.length} users`)
  console.log(`- ${issues.length} issues`)
  console.log(`- Solutions for ${Math.min(3, issues.length)} issues`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
