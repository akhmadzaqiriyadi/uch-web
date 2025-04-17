// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - CMS Kampus',
  description: 'Admin dashboard for CMS Kampus'
}

export default async function DashboardPage() {
    // Await the createClient function to get the Supabase client
    const supabase = await createClient()
    
    // Fetch summary data
    const [
      { count: articlesCount },
      { count: eventsCount },
      { count: usersCount },
      { data: recentArticles },
      { data: upcomingEvents }
    ] = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('events')
        .select('*')
        .eq('status', 'upcoming')
        .order('event_date', { ascending: true })
        .limit(5)
    ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-500">Articles</h2>
              <p className="text-2xl font-bold">{articlesCount || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/articles" className="text-sm text-blue-600 hover:underline">
              Manage Articles →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-500">Events</h2>
              <p className="text-2xl font-bold">{eventsCount || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/events" className="text-sm text-green-600 hover:underline">
              Manage Events →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-500">Users</h2>
              <p className="text-2xl font-bold">{usersCount || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/users" className="text-sm text-purple-600 hover:underline">
              Manage Users →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Articles</h2>
            <Link href="/dashboard/articles" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentArticles && recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <div key={article.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium">{article.title}</h3>
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>Status: <span className={`${article.status === 'published' ? 'text-green-600' : 'text-orange-600'}`}>
                      {article.status}
                    </span></span>
                    <Link href={`/dashboard/articles/${article.id}`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No articles found.</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Upcoming Events</h2>
            <Link href="/dashboard/events" className="text-sm text-green-600 hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <div>
                      {new Date(event.event_date).toLocaleDateString()}, {event.location}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Status: <span className="text-blue-600">{event.status}</span></span>
                      <Link href={`/dashboard/events/${event.id}`} className="text-blue-600 hover:underline">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}