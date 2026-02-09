'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, Beaker, CheckCircle, Bookmark, ExternalLink } from 'lucide-react'
import { toggleSolutionReaction } from '@/lib/actions'

type SolutionCardProps = {
    solution: {
        id: string
        title: string
        type: string
        audience: string // JSON
        steps: string // JSON
        etaMinutes: number
        providerLabel: string
        evidenceTag: string
        url: string | null
        _count: {
            reactions: number
        }
    }
    userReactions: string[]
    userId: string
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
    app: { label: 'アプリ', color: 'bg-blue-500' },
    tool: { label: 'ツール', color: 'bg-green-500' },
    info: { label: '情報', color: 'bg-purple-500' },
    counter: { label: '窓口', color: 'bg-orange-500' },
    checklist: { label: 'チェックリスト', color: 'bg-pink-500' },
}

const PROVIDER_COLORS: Record<string, string> = {
    '公式(行政)': 'bg-blue-100 text-blue-800 border-blue-300',
    '大学': 'bg-purple-100 text-purple-800 border-purple-300',
    '企業': 'bg-green-100 text-green-800 border-green-300',
    '編集部': 'bg-gray-100 text-gray-800 border-gray-300',
}

const EVIDENCE_COLORS: Record<string, string> = {
    '検証済(予定)': 'bg-green-50 text-green-700 border-green-200',
    '公式情報': 'bg-blue-50 text-blue-700 border-blue-200',
    '参考情報': 'bg-gray-50 text-gray-600 border-gray-200',
}

export function SolutionCard({ solution, userReactions, userId }: SolutionCardProps) {
    const [optimisticReactions, setOptimisticReactions] = useState(userReactions)
    const audience = JSON.parse(solution.audience) as string[]
    const steps = JSON.parse(solution.steps) as string[]
    const typeInfo = TYPE_LABELS[solution.type] || { label: solution.type, color: 'bg-gray-500' }

    const handleReaction = async (type: string) => {
        if (!userId) return

        // Optimistic update
        const wasActive = optimisticReactions.includes(type)
        setOptimisticReactions(
            wasActive
                ? optimisticReactions.filter((t) => t !== type)
                : [...optimisticReactions, type]
        )

        await toggleSolutionReaction(solution.id, userId, type)
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={`${typeInfo.color} text-white border-0`}>{typeInfo.label}</Badge>
                    <div className="flex gap-1 flex-wrap justify-end">
                        <Badge variant="outline" className={`text-xs ${PROVIDER_COLORS[solution.providerLabel]}`}>
                            {solution.providerLabel}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${EVIDENCE_COLORS[solution.evidenceTag]}`}>
                            {solution.evidenceTag}
                        </Badge>
                    </div>
                </div>
                <h3 className="font-bold text-lg leading-tight">{solution.title}</h3>
                {audience.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                        {audience.map((aud) => (
                            <Badge key={aud} variant="secondary" className="text-xs">
                                {aud}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardHeader>

            <CardContent className="pb-4">
                <ol className="space-y-2">
                    {steps.map((step, index) => (
                        <li key={index} className="flex gap-2">
                            <span className="font-semibold text-primary shrink-0">{index + 1}.</span>
                            <span className="text-sm">{step}</span>
                        </li>
                    ))}
                </ol>
                <div className="text-xs text-muted-foreground mt-3">
                    ⏱ 所要時間: 約{solution.etaMinutes}分
                </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 border-t pt-4">
                <div className="flex flex-wrap gap-2 w-full">
                    <Button
                        variant={optimisticReactions.includes('HELPFUL') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleReaction('HELPFUL')}
                        className="gap-1"
                    >
                        <ThumbsUp size={14} /> 役に立った
                    </Button>
                    <Button
                        variant={optimisticReactions.includes('WILL_TRY') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleReaction('WILL_TRY')}
                        className="gap-1"
                    >
                        <Beaker size={14} /> 試す
                    </Button>
                    <Button
                        variant={optimisticReactions.includes('SOLVED') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleReaction('SOLVED')}
                        className="gap-1"
                    >
                        <CheckCircle size={14} /> 解決した
                    </Button>
                    <Button
                        variant={optimisticReactions.includes('SAVED') ? 'outline' : 'outline'}
                        size="sm"
                        onClick={() => handleReaction('SAVED')}
                        className="gap-1"
                    >
                        <Bookmark size={14} /> 保存
                    </Button>
                </div>

                {solution.url && (
                    <Button asChild variant="secondary" size="sm" className="w-full gap-2">
                        <a href={solution.url} target="_blank" rel="noopener noreferrer">
                            開く <ExternalLink size={14} />
                        </a>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
