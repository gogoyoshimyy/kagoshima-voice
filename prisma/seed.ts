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

// Realistic sample issues in Japanese
const SAMPLE_ISSUES = [
  { category: '交通', region: '鹿児島市', title: '中央駅のバス乗り場が分かりにくい', summary: '複数の路線が同じ番号に停まるため、どのバスに乗れば良いか迷う人が多い。デジタルサイネージがあると助かります。' },
  { category: '商品要望', region: '鹿児島市', title: '黒豚を使った冷凍餃子が欲しい', summary: '鹿児島の黒豚を使った手軽な冷凍餃子が市内のスーパーにほとんど売っていない。ご当地商品として開発してほしい。' },
  { category: '子育て', region: '霧島市', title: '子ども向け室内遊び場が少ない', summary: '雨の日に子どもを遊ばせる場所が限られています。ショッピングモール内などに室内遊び場があると嬉しいです。' },
  { category: 'サービス要望', region: '姶良市', title: '図書館の開館時間を延長してほしい', summary: '仕事帰りに立ち寄れるよう、平日20時まで開館してほしい。現在18時閉館で利用しづらい。' },
  { category: '生活', region: '鹿児島市', title: '天文館の空き店舗が気になる', summary: 'シャッター通り化が進んでいる。若者向けのポップアップストアなど、活用方法を考えたい。' },
  { category: '観光', region: '指宿市', title: '砂むし温泉の予約システムが欲しい', summary: '観光シーズンは待ち時間が長すぎる。事前予約できるシステムがあれば観光客も助かります。' },
  { category: 'アプリ機能', region: '鹿児島市', title: '市電のリアルタイム位置情報アプリ', summary: 'あと何分で電車が来るかスマホで確認できると便利。特に夏の暑い日は待ち時間を減らしたい。' },
  { category: '商品要望', region: '鹿屋市', title: '地元野菜のサブスクサービス', summary: '毎週新鮮な鹿屋の野菜が届く定期便サービスがあれば、農家も消費者も助かると思います。' },
  { category: 'イベント企画', region: '鹿児島市', title: '夜の水族館イベントを増やしてほしい', summary: 'いおワールドの夜間営業イベントが好評なので、定期開催してほしい。デートスポットとしても人気。' },
  { category: '医療', region: '薩摩川内市', title: '休日診療所の情報がわかりにくい', summary: '子どもが急に熱を出した時、どこに電話すれば良いか迷います。LINEで確認できると助かります。' },
  { category: '教育', region: '鹿児島市', title: 'プログラミング教室を増やしてほしい', summary: '小学生向けのプログラミング教室が市内に少ない。子どもに習わせたいけど選択肢がない。' },
  { category: 'サービス要望', region: '奄美市', title: '島内配送料金を下げてほしい', summary: 'ネット通販の送料が高すぎる。奄美向けの配送料金を見直してほしい。' },
  { category: '防災', region: '霧島市', title: '避難所のWi-Fi整備', summary: '災害時の避難所にフリーWi-Fiがあると、安否確認や情報収集がスムーズになります。' },
  { category: '商品要望', region: '鹿児島市', title: 'さつまいもを使ったヘルシースイーツ', summary: '低カロリーでさつまいもの甘さを活かしたスイーツがもっと欲しい。ダイエット中でも安心して食べられるもの。' },
  { category: '仕事', region: '鹿児島市', title: 'コワーキングスペースを増やしてほしい', summary: 'リモートワーク向けの快適なコワーキングスペースが市内に少ない。天文館や中央駅周辺に増えると嬉しい。' },
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

  // Create Product Updates for some issues
  const updateExamples = [
    { issueIndex: 0, type: 'app', title: 'バス案内アプリをリリース', description: '中央駅のバス乗り場情報をリアルタイムで確認できるアプリを開発します。' },
    { issueIndex: 1, type: 'info', title: '黒豚餃子の試作開始', description: '地元スーパーと共同で黒豚餃子の開発を開始しました。モニター募集中です。' },
    { issueIndex: 2, type: 'event', title: '室内遊び場オープン予定', description: '霧島市のショッピングモール内に子ども向け室内遊び場が3月オープン予定です。' },
    { issueIndex: 6, type: 'app', title: '市電GPSアプリ β版公開', description: '市電の位置情報をリアルタイムで確認できるアプリのβ版を公開しました。' },
    { issueIndex: 8, type: 'event', title: '夜の水族館イベント定期開催決定', description: '毎月第3土曜日に夜の水族館イベントを定期開催することになりました。' },
  ]

  for (const example of updateExamples) {
    const issue = issues[example.issueIndex]
    const update = await prisma.productUpdate.create({
      data: {
        issueId: issue.id,
        type: example.type,
        title: example.title,
        description: example.description,
        url: example.type === 'app' ? 'https://example.com/app' : null,
        isPublished: true,
        startDate: example.type === 'event' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      },
    })

    // Create Notifications for followers
    const followers = await prisma.follow.findMany({ where: { issueId: issue.id } })
    for (const follow of followers) {
      await prisma.notification.create({
        data: {
          userId: follow.userId,
          issueId: issue.id,
          productUpdateId: update.id,
          title: `新しい解決策: ${update.title}`,
          body: `フォロー中の課題について、新しい${example.type}が公開されました。`,
        },
      })
    }
  }

  console.log('Seeding finished. Created:')
  console.log(`- ${users.length} users`)
  console.log(`- ${issues.length} issues`)
  console.log(`- ${updateExamples.length} product updates`)
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
