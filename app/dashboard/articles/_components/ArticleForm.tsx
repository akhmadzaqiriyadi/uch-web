// app/dashboard/articles/_components/ArticleForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Article, Tag } from '@/lib/types'

// Import TipTap editor dynamically to avoid SSR issues
const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), { 
  ssr: false,
  loading: () => <div className="border rounded-md p-4 min-h-[300px] bg-gray-50">Loading editor...</div>
})

type ArticleFormProps = {
  article?: Article
  isEditing?: boolean
}

export default function ArticleForm({ article, isEditing = false }: ArticleFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  // Form state
  const [title, setTitle] = useState(article?.title || '')
  const [content, setContent] = useState(article?.content || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft')
  const [imageUrl, setImageUrl] = useState(article?.image_url || '')
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // Get current user on component mount
  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        
        // Check if user exists in the users table
        const { data: userProfile } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()
          
        // If user doesn't exist in users table, create them
        if (!userProfile) {
          const { data: authUser } = await supabase.auth.getUser()
          
          if (authUser.user) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: authUser.user.id,
                email: authUser.user.email,
                full_name: authUser.user.user_metadata?.full_name || authUser.user.email?.split('@')[0] || 'User',
                role: 'member'
              })
              
            if (insertError) {
              console.error('Error creating user profile:', insertError)
            }
          }
        }
      }
    }
    
    getCurrentUser()
  }, [supabase])
  
  // Load tags on component mount
  useEffect(() => {
    async function loadTags() {
      const { data, error } = await supabase.from('tags').select('*')
      
      if (error) {
        console.error('Error loading tags:', error)
      } else if (data) {
        setTags(data)
      }
    }
    
    loadTags()
  }, [supabase])
  
  // Load selected tags if editing
  useEffect(() => {
    async function loadSelectedTags() {
      if (isEditing && article?.id) {
        const { data, error } = await supabase
          .from('article_tags')
          .select('tag_id')
          .eq('article_id', article.id)
        
        if (error) {
          console.error('Error loading article tags:', error)
        } else if (data) {
          setSelectedTags(data.map(item => item.tag_id))
        }
      }
    }
    
    loadSelectedTags()
  }, [isEditing, article, supabase])
  
  // Generate slug from title
  useEffect(() => {
    if (!isEditing && title && !slug) {
      setSlug(title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
      )
    }
  }, [title, slug, isEditing])
  
  // Handle image upload to ImgBB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setIsUploading(true)
      
      // Create FormData for ImgBB API
      const formData = new FormData()
      formData.append('image', file)
      
      // Replace with your ImgBB API key
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY'
      
      // Upload to ImgBB
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setImageUrl(data.data.url)
      } else {
        throw new Error('Image upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Validate required fields
      if (!title || !slug) {
        throw new Error('Title and slug are required')
      }
      
      // Ensure we have a user ID
      if (!userId) {
        throw new Error('You must be logged in to create or edit articles')
      }
      
      let articleId = article?.id
      
      // Create or update the article
      if (isEditing && articleId) {
        // Update existing article
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title,
            content,  // This is now markdown
            status,
            slug,
            image_url: imageUrl
          })
          .eq('id', articleId)
        
        if (updateError) throw updateError
      } else {
        // Create new article
        const { data: newArticle, error: createError } = await supabase
          .from('articles')
          .insert({
            title,
            content,  // This is now markdown
            status,
            slug,
            image_url: imageUrl,
            author_id: userId
          })
          .select()
        
        if (createError) throw createError
        
        articleId = newArticle?.[0]?.id
      }
      
      // Handle tags if we have an article ID
      if (articleId) {
        // Delete existing tag associations if editing
        if (isEditing) {
          await supabase
            .from('article_tags')
            .delete()
            .eq('article_id', articleId)
        }
        
        // Add selected tags
        if (selectedTags.length > 0) {
          const tagRelations = selectedTags.map(tagId => ({
            article_id: articleId,
            tag_id: tagId
          }))
          
          const { error: tagError } = await supabase
            .from('article_tags')
            .insert(tagRelations)
          
          if (tagError) throw tagError
        }
      }
      
      setSuccessMessage(isEditing ? 'Article updated successfully!' : 'Article created successfully!')
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/articles')
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error('Error saving article:', error)
      setError(error.message || 'Failed to save article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Content - Markdown Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown)
            </label>
            <div>
              {typeof window !== 'undefined' ? (
                <TipTapEditor 
                  content={content}
                  onChange={setContent}
                  editorClassName="min-h-[300px] p-4 bg-white"
                />
              ) : (
                <textarea
                  id="content-fallback"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 min-h-[300px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your article content here using markdown..."
                />
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              The editor will produce markdown content compatible with React Markdown.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="status-draft"
                  name="status"
                  type="radio"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="status-draft" className="ml-3 block text-sm font-medium text-gray-700">
                  Draft
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status-published"
                  name="status"
                  type="radio"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="status-published" className="ml-3 block text-sm font-medium text-gray-700">
                  Published
                </label>
              </div>
            </div>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
                id="image-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </span>
                ) : (
                  <span>Upload Image</span>
                )}
              </label>
            </div>
            
            {imageUrl && (
              <div className="mt-3 relative">
                <img 
                  src={imageUrl} 
                  alt="Featured" 
                  className="h-32 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
              {tags.length > 0 ? (
                tags.map(tag => (
                  <div key={tag.id} className="flex items-center mb-2">
                    <input
                      id={`tag-${tag.id}`}
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`tag-${tag.id}`} className="ml-3 block text-sm text-gray-700">
                      {tag.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tags available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Article' : 'Create Article'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}