import Image from 'next/image';
import Link from 'next/link';
import { EventWithRelations } from '@/lib/types';

export default function EventCard({ event }: { event: EventWithRelations }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {event.image_url && (
        <div className="relative h-48 w-full">
          <Image 
            src={event.image_url} 
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h2>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          {event.author && (
            <>
              {event.author.avatar_url && (
                <Image 
                  src={event.author.avatar_url} 
                  alt={event.author.full_name} 
                  width={24} 
                  height={24} 
                  className="rounded-full mr-2"
                />
              )}
              <span className="mr-3">{event.author.full_name}</span>
            </>
          )}
        </div>
        
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Tanggal:</span>
            <span>{new Date(event.event_date).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Waktu:</span>
            <span>{new Date(event.event_date).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-sm">
              <span className="font-medium mr-2">Lokasi:</span>
              <span>{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 
              event.status === 'done' ? 'bg-gray-100 text-gray-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {event.status === 'upcoming' ? 'Akan Datang' : 
               event.status === 'done' ? 'Selesai' : 'Dibatalkan'}
            </span>
          </div>
        </div>
        
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map(tag => (
              <Link 
                href={`/events/tag/${tag.name}`} 
                key={tag.id}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
        
        <Link 
          href={`/events/${event.id}`}
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}