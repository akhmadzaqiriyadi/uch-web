import { EventWithRelations } from '@/lib/types';
import EventCard from './EventCard';

export default function EventList({ events }: { events: EventWithRelations[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl text-gray-600">Belum ada acara yang tersedia.</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}