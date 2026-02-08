import { PrismaClient } from '@prisma/client'
import { ReactionBar } from '@/components/ReactionBar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { format } from 'date-fns'

const prisma = new PrismaClient()

async function getIssue(id: string) {
    return await prisma.issueCard.findUnique({
        where: { id },
        include: {
            productUpdates: true,
            _count: {
                select: { posts: true, follows: true }
            },
            reactions: {
                select: { type: true, userId: true }
            },
            follows: {
                select: { userId: true }
            }
        }
    })
}

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const issue = await getIssue(id)

    if (!issue) return <div>Issue not found</div>

    // Aggregate reaction counts
    const reactionCounts = {
        LIKE: issue.reactions.filter(r => r.type === 'LIKE').length,
        EMERGENCY: issue.reactions.filter(r => r.type === 'EMERGENCY').length,
        TESTER: issue.reactions.filter(r => r.type === 'TESTER').length,
        SOLVED: issue.reactions.filter(r => r.type === 'SOLVED').length,
        follows: issue._count.follows
    }

    // We need to know if the CURRENT user has reacted. 
    // Since this is a server component and we use localStorage for ID, we can't fully know server-side.
    // However, ReactionBar is a client component, so we can pass the list of userIds who reacted, 
    // and it can check against localStorage. But that leaks userIds.
    // Ideally, we'd use cookies. For this demo, we'll fetch ALL reactions and let the client component
    // filter by its known localStorage ID? No, that's heavy.
    // BETTER APPROACH for DEMO:
    // Just show counts in Server Component. 
    // Pass empty array for "userReactions" initially? 
    // Wait, the client component `ReactionBar` can fetch its own status? 
    // OR: We just don't show the "active" state correctly on first load if we rely on localStorage.
    // Let's pass a list of ALL reaction objects (lightweight enough for demo) to Client Component, 
    // and let it determine active state.

    const allReactions = issue.reactions.map(r => ({ userId: r.userId, type: r.type }))
    const allFollows = issue.follows.map(f => f.userId)

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Badge>{issue.regionScope}</Badge>
                    {JSON.parse(issue.categories).map((c: string) => <Badge key={c} variant="secondary">{c}</Badge>)}
                </div>
                <h1 className="text-3xl font-bold">{issue.title}</h1>
                <p className="text-xl text-slate-600">{issue.summary}</p>

                <div className="text-sm text-muted-foreground">
                    作成日: {format(issue.createdAt, 'yyyy/MM/dd')} • {issue._count.posts} 件の投稿が集約
                </div>
            </div>

            {/* Interaction */}
            <ClientReactionBarWrapper
                issueId={issue.id}
                counts={reactionCounts}
                allReactions={allReactions}
                allFollows={allFollows}
            />

            {/* Product Updates (Solutions) */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    🚀 解決への動き
                    <Badge variant="outline" className="text-lg">
                        {issue.productUpdates.length}
                    </Badge>
                </h2>

                {issue.productUpdates.length === 0 ? (
                    <div className="p-8 bg-slate-50 border rounded-xl text-center text-muted-foreground">
                        まだ動きはありません。この課題をフォローして、進展を待ちましょう！
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {issue.productUpdates.map(update => (
                            <Card key={update.id} className={update.isPublished ? 'border-l-4 border-l-green-500' : ''}>
                                <CardHeader>
                                    <div className="flex justify-between">
                                        <Badge variant={update.type === 'event' ? 'default' : 'secondary'}>
                                            {update.type.toUpperCase()}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {format(update.createdAt, 'yyyy/MM/dd')}
                                        </span>
                                    </div>
                                    <CardTitle>{update.title}</CardTitle>
                                    <CardDescription>{update.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {update.url && (
                                        <a href={update.url} target="_blank" className="text-blue-600 hover:underline">
                                            詳細を見る &rarr;
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                <strong>コミュニティガイドライン:</strong> <br />
                安全な場を保つため、直接のコメント機能はありません。
                共感ボタンやフォローで意思表示をするか、別の視点がある場合は「新しい声」として投稿してください。
            </section>
        </div>
    )
}

// Client Wrapper to handle localStorage check
import { ClientReactionBarWrapper } from './ClientWrapper'
