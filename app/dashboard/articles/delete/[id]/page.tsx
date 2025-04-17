// app/dashboard/articles/delete/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DeleteArticleButton from '../../_components/DeleteArticleButton'

export default async function DeleteArticlePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // Fetch the article to confirm it exists
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title')
    .eq('id', params.id)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Delete Article</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Are you sure you want to delete this article?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Title: {article.title}
          <br />
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <a
            href="/dashboard/articles"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </a>
          <DeleteArticleButton articleId={params.id} />
        </div>
      </div>
    </div>
  )
}