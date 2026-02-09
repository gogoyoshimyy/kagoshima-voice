import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { approvePost, rejectPost } from '@/lib/actions'
import { Check, X } from 'lucide-react'
import { MOCK_POSTS, MOCK_ISSUES } from '@/lib/mockData'

async function getPendingPosts() {
    return MOCK_POSTS
        .filter(p => p.status === 'PENDING')
        .map(p => ({
            ...p,
            issue: MOCK_ISSUES.find(i => i.id === p.issueId)
        }))
}

export default async function ModerationPage() {
    const posts = await getPendingPosts()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">投稿モデレーション</h1>

            {posts.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">未承認の投稿はありません。完了です！</div>
            ) : (
                <div className="grid gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="border p-4 rounded-lg flex gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">ID: {post.id}</span>
                                    <Badge variant="outline">{post.issue?.title || '課題なし'}</Badge>
                                </div>
                                <div className="p-3 bg-slate-50 rounded text-sm relative group">
                                    <span className="text-xs text-muted-foreground absolute top-1 left-2">修正後</span>
                                    {post.textFinal}
                                </div>
                                {post.textOriginal !== post.textFinal && (
                                    <div className="p-3 bg-red-50 rounded text-sm relative text-muted-foreground line-through decoration-red-500">
                                        <span className="text-xs absolute top-1 left-2">元の文章</span>
                                        {post.textOriginal}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <form action={approvePost.bind(null, post.id)}>
                                    <Button size="icon" className="bg-green-600 hover:bg-green-700">
                                        <Check size={18} />
                                    </Button>
                                </form>
                                <form action={rejectPost.bind(null, post.id)}>
                                    <Button size="icon" variant="destructive">
                                        <X size={18} />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
