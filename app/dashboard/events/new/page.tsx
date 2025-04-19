// app/dashboard/events/new/page.tsx

import EventForm from '../_components/EventForm'

export const metadata = {
  title: 'Create Event - CMS Kampus',
  description: 'Create a new event in CMS Kampus'
}

export default function CreateEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <EventForm />
      </div>
    </div>
  )
}