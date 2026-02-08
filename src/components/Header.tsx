import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
    return (
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl flex items-center gap-2">
                    <span className="text-primary">🌋</span>
                    <span>Kagoshima Voice</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        ホーム
                    </Link>
                    <Link href="/dashboard" className="hover:text-foreground transition-colors">
                        ダッシュボード
                    </Link>
                    <Link href="/me" className="hover:text-foreground transition-colors">
                        マイページ
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/post">
                        <Button>声を届ける</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
