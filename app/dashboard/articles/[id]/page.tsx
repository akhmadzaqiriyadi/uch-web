import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleForm from '../_components/ArticleForm'

export const metadata = {
  title: 'Edit Article - CMS Kampus',
  description: 'Edit an article in CMS Kampus'
}

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch the article
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ArticleForm article={article} isEditing={true} />
      </div>
    </div>
  )
}