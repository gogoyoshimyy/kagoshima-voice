'use server'

import { TOXIC_WORDS } from './constants'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

// Demo mode: All actions below are no-ops for static deployment

export async function submitPost(formData: FormData) {
    // Demo mode: no database writes
    // Just redirect to home page
    redirect('/')
}

export async function toggleReaction(issueId: string, userId: string, type: string) {
    // Demo mode: no database writes
    revalidatePath(`/issue/${issueId}`)
}

export async function toggleFollow(issueId: string, userId: string) {
    // Demo mode: no database writes
    revalidatePath(`/issue/${issueId}`)
}

export async function toggleSolutionReaction(solutionId: string, userId: string, type: string) {
    // Demo mode: no database writes
    revalidatePath(`/issue/[id]`, 'page')
}

// Admin actions
export async function approvePost(postId: string) {
    // Demo mode: no database writes
    revalidatePath('/admin/moderation')
}

export async function rejectPost(postId: string) {
    // Demo mode: no database writes
    revalidatePath('/admin/moderation')
}

export async function mergeIssue(fromId: string, toId: string) {
    // Demo mode: no database writes
    revalidatePath('/admin/issues')
}

export async function updateIssue(issueId: string, data: { title?: string, summary?: string }) {
    // Demo mode: no database writes
    revalidatePath('/admin/issues')
}

export async function createProductUpdate(data: any) {
    // Demo mode: no database writes
    revalidatePath('/admin/products')
}
