// app/dashboard/events/_components/EventForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, X, MapPin, Calendar as CalendarIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Event, Tag } from '@/lib/types'

// Import TipTap editor dynamically to avoid SSR issues
const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), { 
  ssr: false,
  loading: () => <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">Loading editor...</div>
})

type EventFormProps = {
  event?: Event
  isEditing?: boolean
}

export default function EventForm({ event, isEditing = false }: EventFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  // Form state
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [eventDate, setEventDate] = useState(event?.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '')
  const [eventTime, setEventTime] = useState(event?.event_date ? new Date(event.event_date).toISOString().split('T')[1].substring(0, 5) : '')
  const [location, setLocation] = useState(event?.location || '')
  const [status, setStatus] = useState<'upcoming' | 'done' | 'canceled'>(event?.status || 'upcoming')
  const [imageUrl, setImageUrl] = useState(event?.image_url || '')
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
      if (isEditing && event?.id) {
        const { data, error } = await supabase
          .from('event_tags')
          .select('tag_id')
          .eq('event_id', event.id)
        
        if (error) {
          console.error('Error loading event tags:', error)
        } else if (data) {
          setSelectedTags(data.map(item => item.tag_id))
        }
      }
    }
    
    loadSelectedTags()
  }, [isEditing, event, supabase])
  
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
      if (!title || !eventDate) {
        throw new Error('Title and event date are required')
      }
      
      // Ensure we have a user ID
      if (!userId) {
        throw new Error('You must be logged in to create or edit events')
      }
      
      // Combine date and time
      const combinedDateTime = eventTime 
        ? `${eventDate}T${eventTime}:00` 
        : `${eventDate}T00:00:00`;
      
      let eventId = event?.id
      
      // Create or update the event
      if (isEditing && eventId) {
        // Update existing event
        const { error: updateError } = await supabase
          .from('events')
          .update({
            title,
            description,
            event_date: combinedDateTime,
            location,
            status,
            image_url: imageUrl
          })
          .eq('id', eventId)
        
        if (updateError) throw updateError
      } else {
        // Create new event
        const { data: newEvent, error: createError } = await supabase
          .from('events')
          .insert({
            title,
            description,
            event_date: combinedDateTime,
            location,
            status,
            image_url: imageUrl,
            author_id: userId
          })
          .select()
        
        if (createError) throw createError
        
        eventId = newEvent?.[0]?.id
      }
      
      // Handle tags if we have an event ID
      if (eventId) {
        // Delete existing tag associations if editing
        if (isEditing) {
          await supabase
            .from('event_tags')
            .delete()
            .eq('event_id', eventId)
        }
        
        // Add selected tags
        if (selectedTags.length > 0) {
          const tagRelations = selectedTags.map(tagId => ({
            event_id: eventId,
            tag_id: tagId
          }))
          
          const { error: tagError } = await supabase
            .from('event_tags')
            .insert(tagRelations)
          
          if (tagError) throw tagError
        }
      }
      
      setSuccessMessage(isEditing ? 'Event updated successfully!' : 'Event created successfully!')
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/events')
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error('Error saving event:', error)
      setError(error.message || 'Failed to save event. Please try again.')
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
              Event Title *
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
          
          {/* Event Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-date" className="block text-sm font-medium text-gray-700">
                Event Date *
              </label>
              <div className="mt-1 relative">
                <input
                  type="date"
                  id="event-date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label htmlFor="event-time" className="block text-sm font-medium text-gray-700">
                Event Time
              </label>
              <input
                type="time"
                id="event-time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Event location"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Description - Markdown Editor */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div>
              {typeof window !== 'undefined' ? (
                <TipTapEditor 
                  content={description}
                  onChange={setDescription}
                  editorClassName="min-h-[200px] p-4 bg-white"
                />
              ) : (
                <textarea
                  id="description-fallback"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 min-h-[200px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your event description here using markdown..."
                />
              )}
            </div>
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
                  id="status-upcoming"
                  name="status"
                  type="radio"
                  value="upcoming"
                  checked={status === 'upcoming'}
                  onChange={() => setStatus('upcoming')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="status-upcoming" className="ml-3 block text-sm font-medium text-gray-700">
                  Upcoming
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status-done"
                  name="status"
                  type="radio"
                  value="done"
                  checked={status === 'done'}
                  onChange={() => setStatus('done')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="status-done" className="ml-3 block text-sm font-medium text-gray-700">
                  Done
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status-canceled"
                  name="status"
                  type="radio"
                  value="canceled"
                  checked={status === 'canceled'}
                  onChange={() => setStatus('canceled')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="status-canceled" className="ml-3 block text-sm font-medium text-gray-700">
                  Canceled
                </label>
              </div>
            </div>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Image
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
                  alt="Event" 
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
              {isEditing ? 'Update Event' : 'Create Event'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}