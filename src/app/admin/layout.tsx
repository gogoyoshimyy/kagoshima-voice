import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-screen">
            <aside className="w-full md:w-64 space-y-4">
                <h2 className="font-bold text-xl px-4">管理画面</h2>
                <nav className="flex flex-col gap-1 p-2 bg-white rounded-lg border shadow-sm">
                    <Link href="/admin/moderation" className="p-2 hover:bg-slate-100 rounded">モデレーション</Link>
                    <Link href="/admin/issues" className="p-2 hover:bg-slate-100 rounded">課題一覧</Link>
                    <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded">解決策の更新</Link>
                </nav>
            </aside>
            <main className="flex-1 bg-white p-6 rounded-lg border shadow-sm">
                {children}
            </main>
        </div>
    )
}
