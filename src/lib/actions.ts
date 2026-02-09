import { TOXIC_WORDS } from './constants'

// Mock toxicity check (can run on client)
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

// Client-side no-op actions for static export demo

export async function submitPost(formData: FormData) {
    // Demo mode: do nothing
}

export async function toggleReaction(issueId: string, userId: string, type: string) {
    // Demo mode: do nothing
}

export async function toggleFollow(issueId: string, userId: string) {
    // Demo mode: do nothing
}

export async function toggleSolutionReaction(solutionId: string, userId: string, type: string) {
    // Demo mode: do nothing
}

// Admin actions
export async function approvePost(postId: string) {
    // Demo mode: do nothing
}

export async function rejectPost(postId: string) {
    // Demo mode: do nothing
}

export async function mergeIssue(fromId: string, toId: string) {
    // Demo mode: do nothing
}

export async function updateIssue(issueId: string, data: { title?: string, summary?: string }) {
    // Demo mode: do nothing
}

export async function createProductUpdate(data: any) {
    // Demo mode: do nothing
}
