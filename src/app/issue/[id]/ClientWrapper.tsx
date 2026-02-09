'use client'

import { useState, useEffect } from 'react'
import { ReactionBar } from '@/components/ReactionBar'
import { SolutionCard } from '@/components/SolutionCard'

export function ClientReactionBarWrapper({
    issueId,
    counts,
    allReactions,
    allFollows
}: {
    issueId: string,
    counts: any,
    allReactions: { userId: string, type: string }[],
    allFollows: string[]
}) {
    const [userId, setUserId] = useState('')

    useEffect(() => {
        const id = localStorage.getItem('kv_user_id')
        if (id) setUserId(id)
    }, [])

    const userReactions = allReactions
        .filter(r => r.userId === userId)
        .map(r => r.type)

    const isFollowing = allFollows.includes(userId)

    return (
        <ReactionBar
            issueId={issueId}
            counts={counts}
            userReactions={userReactions}
            isFollowing={isFollowing}
        />
    )
}

export function ClientSolutionCardWrapper({
    solution,
    allReactions
}: {
    solution: any,
    allReactions: { userId: string, type: string }[]
}) {
    const [userId, setUserId] = useState('')

    useEffect(() => {
        const id = localStorage.getItem('kv_user_id')
        if (id) setUserId(id)
    }, [])

    const userReactions = allReactions
        .filter(r => r.userId === userId)
        .map(r => r.type)

    return (
        <SolutionCard
            solution={solution}
            userReactions={userReactions}
            userId={userId}
        />
    )
}
