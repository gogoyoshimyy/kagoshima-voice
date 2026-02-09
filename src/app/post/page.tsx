import { PostForm } from '@/components/PostForm'

export default function PostPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-10">コミュニティに声を投稿</h1>
            <PostForm />
        </div>
    )
}
