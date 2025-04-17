// app/dashboard/articles/_components/DeleteArticleButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

type DeleteArticleButtonProps = {
  articleId: string
}

export default function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)
      
      if (error) throw error
      
      // Redirect to articles list after deletion
      router.push('/dashboard/articles')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      disabled={isDeleting}
    >
      {isDeleting ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </>
      )}
    </button>
  )
}