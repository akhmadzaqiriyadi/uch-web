// app/dashboard/articles/new/page.tsx
import ArticleForm from '../_components/ArticleForm'

export const metadata = {
  title: 'Create Article - CMS Kampus',
  description: 'Create a new article in CMS Kampus'
}

export default function CreateArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ArticleForm />
      </div>
    </div>
  )
}