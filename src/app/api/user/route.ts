import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            follows: {
                include: { issue: { select: { id: true, title: true, regionScope: true } } }
            },
            notifications: {
                orderBy: { createdAt: 'desc' },
                take: 10
            }
        }
    })

    // Count posts this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const postCount = await prisma.post.count({
        where: {
            userId: id,
            createdAt: { gte: oneWeekAgo }
        }
    })

    return NextResponse.json({
        follows: user?.follows || [],
        notifications: user?.notifications || [],
        postCount
    })
}
