'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toggleReaction, toggleFollow } from '@/lib/actions'
import { ThumbsUp, Flame, CheckCircle, Bell, UserPlus } from 'lucide-react'

type ReactionBarProps = {
    issueId: string
    counts: {
        LIKE: number
        EMERGENCY: number
        TESTER: number
        SOLVED: number
        follows: number
    }
    userReactions: string[] // Types the user has reacted with
    isFollowing: boolean
}

export function ReactionBar({ issueId, counts, userReactions, isFollowing }: ReactionBarProps) {
    const [userId, setUserId] = useState('')

    useEffect(() => {
        let id = localStorage.getItem('kv_user_id')
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem('kv_user_id', id)
        }
        setUserId(id)
    }, [])

    const handleReaction = async (type: string) => {
        if (!userId) return
        await toggleReaction(issueId, userId, type)
    }

    const handleFollow = async () => {
        if (!userId) return
        await toggleFollow(issueId, userId)
    }

    return (
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl border">
            <Button
                variant={userReactions.includes('LIKE') ? 'default' : 'outline'}
                onClick={() => handleReaction('LIKE')}
                className="gap-2"
            >
                <ThumbsUp size={18} /> 共感 ({counts.LIKE})
            </Button>

            <Button
                variant={userReactions.includes('EMERGENCY') ? 'destructive' : 'outline'}
                onClick={() => handleReaction('EMERGENCY')}
                className={`gap-2 ${!userReactions.includes('EMERGENCY') && 'text-red-500 hover:text-red-600'}`}
            >
                <Flame size={18} /> 急ぎ ({counts.EMERGENCY})
            </Button>

            <Button
                variant={userReactions.includes('TESTER') ? 'secondary' : 'outline'}
                onClick={() => handleReaction('TESTER')}
                className="gap-2"
            >
                <UserPlus size={18} /> 検証可 ({counts.TESTER})
            </Button>

            <div className="flex-1" />

            <Button
                variant={isFollowing ? 'default' : 'outline'}
                onClick={handleFollow}
                className={`gap-2 ${isFollowing ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 border-blue-200'}`}
            >
                <Bell size={18} /> {isFollowing ? 'フォロー中' : 'フォロー'} ({counts.follows})
            </Button>
        </div>
    )
}
