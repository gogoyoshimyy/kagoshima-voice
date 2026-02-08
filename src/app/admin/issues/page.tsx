import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function AdminIssuesPage() {
    const issues = await prisma.issueCard.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">課題管理</h1>
            <div className="border rounded-lg divide-y">
                {issues.map(i => (
                    <div key={i.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                        <div>
                            <div className="font-semibold">{i.title}</div>
                            <div className="text-xs text-muted-foreground">{i.regionScope}</div>
                        </div>
                        <Link href={`/issue/${i.id}`} className="text-blue-600 text-sm">詳細</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
