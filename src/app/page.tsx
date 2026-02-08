import { PrismaClient } from '@prisma/client'
import { IssueCard } from '@/components/IssueCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const prisma = new PrismaClient()

async function getIssues() {
  // In a real app, we would use search params for filtering.
  // For this demo, we just fetch mostly recent ones.
  const issues = await prisma.issueCard.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { posts: true, reactions: true, follows: true }
      },
      reactions: {
        select: { type: true }
      }
    },
    take: 20
  })
  return issues
}

export default async function Home() {
  const issues = await getIssues()

  return (
    <div className="space-y-8">
      {/* Hero / Welcome */}
      <section className="text-center py-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-indigo-100">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
          Kagoshima Voice 🌋
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          地域の困りごとを、前向きに解決へ。<br />
          あなたの声を届け、みんなで解決策を見つけましょう。
        </p>
        <Link href="/post">
          <Button size="lg" className="rounded-full px-8 text-lg shadow-xl shadow-primary/20">
            声を届ける
          </Button>
        </Link>
      </section>

      {/* Filters (Visual only for demo) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sticky top-16 bg-slate-50/95 backdrop-blur z-40 py-4 border-b">
        <Tabs defaultValue="week" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="today">今日</TabsTrigger>
            <TabsTrigger value="week">今週</TabsTrigger>
            <TabsTrigger value="month">今月</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {/* Mock dropdowns */}
          <Button variant="outline" size="sm">地域: すべて</Button>
          <Button variant="outline" size="sm">カテゴリ: すべて</Button>
        </div>
      </div>

      {/* Issue Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </section>

      {issues.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          まだ投稿がありません。最初の声を届けましょう！
        </div>
      )}
    </div>
  )
}
