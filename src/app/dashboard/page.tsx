import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORIES, REGIONS } from '@/lib/constants'

const prisma = new PrismaClient()

async function getStats() {
    const totalIssues = await prisma.issueCard.count()
    const totalPosts = await prisma.post.count()
    const totalReactions = await prisma.reaction.count()
    const solvedIssues = await prisma.reaction.count({ where: { type: 'SOLVED' } })

    // Simple category distribution (fetching all issues is heavy for real app, but ok for demo)
    const allIssues = await prisma.issueCard.findMany({ select: { categories: true, regionScope: true } })

    const categoryCounts: Record<string, number> = {}
    CATEGORIES.forEach(c => categoryCounts[c] = 0)

    const regionCounts: Record<string, number> = {}
    REGIONS.forEach(r => regionCounts[r] = 0)

    allIssues.forEach(issue => {
        const cats = JSON.parse(issue.categories) as string[]
        cats.forEach(c => {
            if (categoryCounts[c] !== undefined) categoryCounts[c]++
        })

        if (regionCounts[issue.regionScope] !== undefined) {
            regionCounts[issue.regionScope]++
        }
    })

    // Recent solutions
    const recentUpdates = await prisma.productUpdate.findMany({
        where: { isPublished: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { issue: true }
    })

    return { totalIssues, totalPosts, totalReactions, solvedIssues, categoryCounts, regionCounts, recentUpdates }
}

export default async function DashboardPage() {
    const stats = await getStats()

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Kagoshima Voice ダッシュボード</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">課題総数</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalIssues}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">声の総数</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalPosts}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">リアクション</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalReactions}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">解決済み</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats.solvedIssues}</div></CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Category Chart (Bar chart representation using simple divs) */}
                <Card>
                    <CardHeader><CardTitle>カテゴリ別課題数</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(stats.categoryCounts)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 8) // Top 8
                            .map(([cat, count]) => (
                                <div key={cat} className="flex items-center gap-2">
                                    <div className="w-24 text-sm truncate" title={cat}>{cat}</div>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${Math.max(5, (count / stats.totalIssues) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-xs w-8 text-right">{count}</div>
                                </div>
                            ))}
                    </CardContent>
                </Card>

                {/* Region Chart */}
                <Card>
                    <CardHeader><CardTitle>地域別課題数</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(stats.regionCounts)
                            .sort(([, a], [, b]) => b - a)
                            .map(([region, count]) => (
                                <div key={region} className="flex items-center gap-2">
                                    <div className="w-24 text-sm truncate" title={region}>{region}</div>
                                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${Math.max(5, (count / stats.totalIssues) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="text-xs w-8 text-right">{count}</div>
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Solutions */}
            <Card>
                <CardHeader><CardTitle>最近の解決事例</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {stats.recentUpdates.map(update => (
                            <li key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
                                <div className="font-semibold text-green-700">
                                    [{update.type.toUpperCase()}] {update.title}
                                </div>
                                <div className="text-sm text-slate-600 mb-1">
                                    関連課題: {update.issue.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {update.description}
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
