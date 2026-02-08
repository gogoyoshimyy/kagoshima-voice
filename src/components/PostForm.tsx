'use client'

import { useState, useEffect } from 'react'
import { CATEGORIES, REGIONS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { checkToxicity, submitPost } from '@/lib/actions'
import { Loader2 } from 'lucide-react'

export function PostForm() {
    const [step, setStep] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [region, setRegion] = useState('')
    const [text, setText] = useState('')
    const [rewrittenText, setRewrittenText] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [userId, setUserId] = useState('')
    const [limitError, setLimitError] = useState('')

    useEffect(() => {
        let id = localStorage.getItem('kv_user_id')
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem('kv_user_id', id)
        }
        setUserId(id)
    }, [])

    const handleCategoryToggle = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat))
        } else {
            if (selectedCategories.length < 3) {
                setSelectedCategories([...selectedCategories, cat])
            }
        }
    }

    const handleNext = () => {
        if (selectedCategories.length > 0 && region) {
            setStep(2)
        }
    }

    const handleCheck = async () => {
        if (!text) return
        setIsChecking(true)
        const result = await checkToxicity(text)
        setIsChecking(false)

        if (result.isToxic) {
            setRewrittenText(result.rewritten)
        } else {
            setRewrittenText(text) // No change needed
        }
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append('categories', JSON.stringify(selectedCategories))
        formData.append('region', region)
        formData.append('textOriginal', text)
        formData.append('textFinal', rewrittenText || text)
        formData.append('userId', userId)

        const res = await submitPost(formData)
        if (res?.error) {
            setLimitError(res.error)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex justify-between items-center px-4">
                <div className={`h-2 w-1/2 rounded-l-full ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`} />
                <div className={`h-2 w-1/2 rounded-r-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 ? 'Step 1: 何についての声ですか？' : 'Step 2: 詳しく教えてください'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <>
                            <div>
                                <Label className="mb-2 block">地域</Label>
                                <Select onValueChange={setRegion} value={region}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="地域を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIONS.map(r => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2 block">カテゴリ (3つまで選択)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <Badge
                                            key={cat}
                                            variant={selectedCategories.includes(cat) ? 'default' : 'outline'}
                                            className="cursor-pointer px-4 py-2"
                                            onClick={() => handleCategoryToggle(cat)}
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleNext} disabled={!region || selectedCategories.length === 0}>
                                    次へ
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <Label className="mb-2 block">あなたの声（元の文章）</Label>
                                <Textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="困りごとや提案を詳しく書いてください..."
                                    className="h-32"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => handleCheck()} disabled={!text || isChecking}>
                                    {isChecking ? <Loader2 className="animate-spin" /> : 'トーンチェック'}
                                </Button>
                            </div>

                            {rewrittenText && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <Label className="mb-2 block text-green-800">✨ 提案された前向きな表現:</Label>
                                    <p className="mb-4">{rewrittenText}</p>
                                    <div className="flex gap-2 text-sm text-muted-foreground">
                                        <Button size="sm" onClick={handleSubmit}>
                                            この内容で投稿する
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setRewrittenText('')}>
                                            元の文章を修正する
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!rewrittenText && text && !isChecking && (
                                <div className="text-right text-sm text-muted-foreground">
                                    投稿前にトーンチェックをしてください。
                                </div>
                            )}

                            {limitError && (
                                <div className="text-red-500 font-bold p-4 bg-red-50 rounded">
                                    {limitError}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
