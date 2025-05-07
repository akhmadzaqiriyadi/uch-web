import { getUpcomingEvents } from '@/lib/events';
import EventList from '@/components/EventList';

export const metadata = {
  title: 'Acara - CMS Kampus',
  description: 'Kumpulan acara terbaru dari komunitas kampus'
}

export default async function EventsPage() {
  const events = await getUpcomingEvents();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Acara Mendatang</h1>
      <EventList events={events} />
    </main>
  );
}

