import { NextRequest, NextResponse } from 'next/server'
import { MOCK_ISSUES, MOCK_POSTS, MOCK_FOLLOWS, MOCK_NOTIFICATIONS, MockNotification } from '@/lib/mockData' // Need to export MOCK_NOTIFICATION if not already

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // Mock follows
    const follows = MOCK_FOLLOWS.filter(f => f.userId === id).map(f => {
        const issue = MOCK_ISSUES.find(i => i.id === f.issueId)
        return {
            ...f,
            issue: issue ? { id: issue.id, title: issue.title, regionScope: issue.regionScope } : null
        }
    })

    // Mock notifications (empty for now or add to mock data)
    const notifications: MockNotification[] = []

    // Count posts this week
    const postCount = MOCK_POSTS.filter(p => p.userId === id).length

    return NextResponse.json({
        follows,
        notifications,
        postCount
    })
}
