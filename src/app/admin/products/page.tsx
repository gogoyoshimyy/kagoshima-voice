'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createProductUpdate } from '@/lib/actions'
import { MOCK_ISSUES } from '@/lib/mockData'

async function getIssues() {
    return MOCK_ISSUES
}

export default async function AdminProductsPage() {
    const issues = await getIssues()

    return (
        <div className="space-y-8 max-w-2xl">
            <h1 className="text-2xl font-bold">解決策の更新を作成</h1>
            <p className="text-muted-foreground">課題カードに更新情報を追加し、フォロワーに通知を送ります。</p>

            <form action={createProductUpdate} className="space-y-4 border p-6 rounded-lg bg-slate-50">
                <div>
                    <Label>対象の課題</Label>
                    <select name="issueId" className="w-full p-2 border rounded" required>
                        <option value="">課題を選択</option>
                        {issues.map(i => (
                            <option key={i.id} value={i.id}>{i.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label>種類</Label>
                    <select name="type" className="w-full p-2 border rounded" required>
                        <option value="app">アプリ機能</option>
                        <option value="event">イベント</option>
                        <option value="info">お知らせ</option>
                    </select>
                </div>

                <div>
                    <Label>タイトル</Label>
                    <Input name="title" placeholder="例: 新しいバス路線が追加されました" required />
                </div>

                <div>
                    <Label>詳細</Label>
                    <Textarea name="description" placeholder="更新の内容を詳しく..." required />
                </div>

                <div>
                    <Label>URL (任意)</Label>
                    <Input name="url" placeholder="https://..." />
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="isPublished" id="pub" defaultChecked />
                    <Label htmlFor="pub">すぐに公開して通知を送る</Label>
                </div>

                <Button type="submit">更新を作成</Button>
            </form>
        </div>
    )
}
