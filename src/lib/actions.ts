'use server'

import { PrismaClient } from '@prisma/client'
import { TOXIC_WORDS } from './constants'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

// Mock toxicity check
export async function checkToxicity(text: string) {
    let rewritten = text
    let isToxic = false
    const foundWords: string[] = []

    Object.entries(TOXIC_WORDS).forEach(([toxic, safe]) => {
        if (text.includes(toxic)) {
            isToxic = true
            rewritten = rewritten.replace(new RegExp(toxic, 'g'), safe)
            foundWords.push(toxic)
        }
    })

    // Simple PII check (mock)
    const phoneRegex = /\d{2,4}-\d{2,4}-\d{4}/g
    if (phoneRegex.test(rewritten)) {
        isToxic = true
        rewritten = rewritten.replace(phoneRegex, '***-****-****')
        foundWords.push('Phone Number')
    }

    return { isToxic, rewritten, foundWords }
}

export async function submitPost(formData: FormData) {
    const categories = JSON.parse(formData.get('categories') as string)
    const region = formData.get('region') as string
    const textOriginal = formData.get('textOriginal') as string
    const textFinal = formData.get('textFinal') as string
    const userId = formData.get('userId') as string // Mock ID from localStorage

    // 1. Check if user exists, if not create (for demo simplicity)
    let user = await prisma.user.findFirst({ where: { id: userId } })
    if (!user) {
        user = await prisma.user.create({ data: { id: userId } })
    }

    // 2. Check weekly limit (mock logic: just count posts in last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const postsCount = await prisma.post.count({
        where: {
            userId: user.id,
            createdAt: { gte: oneWeekAgo }
        }
    })

    if (postsCount >= 3) {
        return { error: '今週の投稿上限（3件）に達しました。' }
    }

    // 3. Find matching IssueCard or create new
    // For demo: just match by Category + Region, or create new.
    let issue = await prisma.issueCard.findFirst({
        where: {
            regionScope: region,
            categories: { contains: categories[0] } // Simple match
        }
    })

    if (!issue) {
        issue = await prisma.issueCard.create({
            data: {
                title: `${categories[0]} の課題（${region}）`,
                summary: textFinal.slice(0, 50) + '...',
                categories: JSON.stringify(categories),
                regionScope: region,
                isPublic: true
            }
        })
    }

    // 4. Create Post
    await prisma.post.create({
        data: {
            userId: user.id,
            issueId: issue.id,
            textOriginal,
            textFinal,
            categories: JSON.stringify(categories),
            region,
            status: 'APPROVED' // For demo flow ease
        }
    })

    revalidatePath('/')
    redirect(`/issue/${issue.id}`)
}

export async function toggleReaction(issueId: string, userId: string, type: string) {
    // Check if reaction exists
    const existing = await prisma.reaction.findUnique({
        where: {
            issueId_userId_type: {
                issueId,
                userId,
                type
            }
        }
    })

    if (existing) {
        await prisma.reaction.delete({
            where: { id: existing.id }
        })
    } else {
        await prisma.reaction.create({
            data: {
                issueId,
                userId,
                type
            }
        })
    }

    revalidatePath(`/issue/${issueId}`)
}

export async function toggleFollow(issueId: string, userId: string) {
    const existing = await prisma.follow.findUnique({
        where: {
            issueId_userId: {
                issueId,
                userId
            }
        }
    })

    if (existing) {
        await prisma.follow.delete({
            where: { id: existing.id }
        })
    } else {
        await prisma.follow.create({
            data: {
                issueId,
                userId
            }
        })
    }
    revalidatePath(`/issue/${issueId}`)
}

export async function approvePost(postId: string) {
    await prisma.post.update({
        where: { id: postId },
        data: { status: 'APPROVED' }
    })
    // Log moderation
    await prisma.moderationLog.create({
        data: {
            postId,
            reviewer: 'ADMIN', // Mock
            action: 'APPROVED'
        }
    })
    revalidatePath('/admin/moderation')
}

export async function rejectPost(postId: string) {
    await prisma.post.update({
        where: { id: postId },
        data: { status: 'REJECTED' }
    })
    await prisma.moderationLog.create({
        data: {
            postId,
            reviewer: 'ADMIN',
            action: 'REJECTED'
        }
    })
    revalidatePath('/admin/moderation')
}

export async function createProductUpdate(formData: FormData) {
    const issueId = formData.get('issueId') as string
    const type = formData.get('type') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const url = formData.get('url') as string
    const isPublished = formData.get('isPublished') === 'on'

    const update = await prisma.productUpdate.create({
        data: {
            issueId,
            type,
            title,
            description,
            url,
            isPublished
        }
    })

    if (isPublished) {
        // Notify followers
        const follows = await prisma.follow.findMany({ where: { issueId } })
        for (const follow of follows) {
            await prisma.notification.create({
                data: {
                    userId: follow.userId,
                    issueId,
                    productUpdateId: update.id,
                    title: `新しい解決策: ${title}`,
                    body: `フォロー中の課題について、新しい${type}が公開されました。`
                }
            })
        }
    }

    revalidatePath(`/admin/products`)
    revalidatePath(`/issue/${issueId}`)
    redirect('/admin/products')
}
