'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { MOCK_POSTS, MOCK_FOLLOWS, MOCK_NOTIFICATIONS, MOCK_ISSUES } from '@/lib/mockData'

type UserData = {
    follows: any[]
    notifications: any[]
    postCount: number
}

export default function MePage() {
    const [userId, setUserId] = useState('')
    const [data, setData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = localStorage.getItem('kv_user_id')
        if (id) {
            setUserId(id)
            // Static export: fetch from mock data
            // In real app: API call

            // For demo purposes, we check if this ID has any data in mock
            const hasPosts = MOCK_POSTS.some(p => p.userId === id)

            // If local ID matches no data (random ID), fallback to demo user 'user-001' to show something
            const targetId = hasPosts ? id : 'user-001'

            const userPosts = MOCK_POSTS.filter(p => p.userId === targetId)
            const postCount = userPosts.length

            const follows = MOCK_FOLLOWS.filter(f => f.userId === targetId).map(f => {
                const issue = MOCK_ISSUES.find(i => i.id === f.issueId)
                return {
                    ...f,
                    issue: issue ? { id: issue.id, title: issue.title, regionScope: issue.regionScope } : null
                }
            })

            const notifications = MOCK_NOTIFICATIONS.filter(n => n.userId === targetId)

            setData({
                follows,
                notifications,
                postCount
            })
        }
        setLoading(false)
    }, [])

    if (loading) return <div className="p-10 text-center">読み込み中...</div>

    if (!userId) {
        return <div className="p-10 text-center">アプリを使い始めると、ここにプロフィールが表示されます。</div>
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">マイページ</h1>

            <div className="flex gap-4">
                <Card className="flex-1">
                    <CardHeader><CardTitle className="text-sm">今週の声</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data?.postCount || 0} / 3</div>
                        <div className="text-xs text-muted-foreground">月曜リセット</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>お知らせ</CardTitle></CardHeader>
                    <CardContent>
                        {data?.notifications.length === 0 ? (
                            <div className="text-sm text-muted-foreground">まだお知らせはありません。</div>
                        ) : (
                            <ul className="space-y-4">
                                {data?.notifications.map((n: any) => (
                                    <li key={n.id} className={`p-3 rounded border ${!n.isRead ? 'bg-blue-50 border-blue-200' : 'bg-slate-50'}`}>
                                        <div className="font-semibold text-sm">{n.title}</div>
                                        <div className="text-xs text-muted-foreground mb-1">{n.body}</div>
                                        <div className="text-xs text-right text-slate-400">
                                            {format(new Date(n.createdAt), 'MM/dd HH:mm')}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>フォロー中の課題</CardTitle></CardHeader>
                    <CardContent>
                        {data?.follows.length === 0 ? (
                            <div className="text-sm text-muted-foreground">まだフォローしている課題はありません。</div>
                        ) : (
                            <ul className="space-y-3">
                                {data?.follows.map((f: any) => (
                                    <li key={f.id} className="p-2 border rounded hover:shadow-sm transition-shadow">
                                        <Link href={`/issue/${f.issue.id}`} className="block">
                                            <div className="text-sm font-semibold truncate">{f.issue.title}</div>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px]">{f.issue.regionScope}</Badge>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
