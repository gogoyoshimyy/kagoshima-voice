import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, Bell, MessageSquare, AlertTriangle } from 'lucide-react'

// Define a type that matches the data we'll pass. 
// We can improve this with Prisma generated types later.
type IssueCardProps = {
    issue: {
        id: string
        title: string
        summary: string
        categories: string // JSON string
        regionScope: string
        _count: {
            posts: number
            reactions: number
            follows: number
        }
        reactions: { type: string }[]
    }
}

export function IssueCard({ issue }: IssueCardProps) {
    const categories = JSON.parse(issue.categories) as string[]
    const reactionCount = issue._count.reactions
    const followCount = issue._count.follows
    const postCount = issue._count.posts

    // Determine an "Urgency" or "Empathy" level for visual flair (demo purpose)
    const isHot = reactionCount > 5

    return (
        <Card className={`hover:shadow-lg transition-shadow ${isHot ? 'border-primary/50' : ''}`}>
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{issue.regionScope}</Badge>
                        {categories.map((cat) => (
                            <Badge key={cat} variant="secondary">{cat}</Badge>
                        ))}
                    </div>
                    {isHot && <Badge variant="destructive" className="flex gap-1"><AlertTriangle size={12} /> 注目</Badge>}
                </div>
                <CardTitle className="text-xl leading-tight">
                    <Link href={`/issue/${issue.id}`} className="hover:underline">
                        {issue.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                    {issue.summary}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                        <ThumbsUp size={16} /> {reactionCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <Bell size={16} /> {followCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare size={16} /> {postCount} 件の投稿が集約
                    </span>
                </div>
                <Link href={`/issue/${issue.id}`}>
                    <Button variant="ghost" size="sm">詳細を見る &rarr;</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
