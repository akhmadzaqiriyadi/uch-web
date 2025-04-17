import Link from 'next/link';
import { getPublishedArticles } from '@/lib/articles';
import { getUpcomingEvents } from '@/lib/events';
import ArticleCard from '@/components/ArticleCard';
import EventCard from '@/components/EventCard';

export default async function HomePage() {
  // Fetch both latest articles and upcoming events
  const latestArticles = await getPublishedArticles();
  const upcomingEvents = await getUpcomingEvents();
  
  // Limit to the most recent ones for display
  const featuredArticles = latestArticles.slice(0, 3);
  const featuredEvents = upcomingEvents.slice(0, 3);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Acara Mendatang</h2>
          <Link 
            href="/events" 
            className="text-blue-600 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        
        {featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-xl text-gray-600">
              Belum ada acara mendatang.
            </h3>
          </div>
        )}
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
          <Link 
            href="/articles" 
            className="text-blue-600 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        
        {featuredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-xl text-gray-600">
              Belum ada artikel yang dipublikasikan.
            </h3>
          </div>
        )}
      </section>
    </main>
  );
}