// app/dashboard/events/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventForm from '../_components/EventForm'

export const metadata = {
  title: 'Edit Event - CMS Kampus',
  description: 'Edit an event in CMS Kampus'
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  
  // Await params before accessing properties
  const { id } = await params

  // Fetch the event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <EventForm event={event} isEditing={true} />
      </div>
    </div>
  )
}