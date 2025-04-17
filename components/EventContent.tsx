import Image from 'next/image';
import Link from 'next/link';
import { EventWithRelations } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

export default function EventContent({ event }: { event: EventWithRelations }) {
  return (
    <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          {event.author && (
            <div className="flex items-center mr-4">
              {event.author.avatar_url && (
                <Image 
                  src={event.author.avatar_url} 
                  alt={event.author.full_name} 
                  width={32} 
                  height={32} 
                  className="rounded-full mr-2"
                />
              )}
              <span>{event.author.full_name}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Featured Image */}
      {event.image_url && (
        <div className="relative h-72 w-full mb-6">
          <Image 
            src={event.image_url} 
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}
      
      {/* Event Details */}
      <div className="px-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Detail Acara</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Tanggal</p>
              <p className="font-medium">{new Date(event.event_date).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Waktu</p>
              <p className="font-medium">{new Date(event.event_date).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            
            {event.location && (
              <div className="md:col-span-2">
                <p className="text-gray-600 mb-1">Lokasi</p>
                <p className="font-medium">{event.location}</p>
              </div>
            )}
            
            <div>
              <p className="text-gray-600 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 
                event.status === 'done' ? 'bg-gray-100 text-gray-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {event.status === 'upcoming' ? 'Akan Datang' : 
                 event.status === 'done' ? 'Selesai' : 'Dibatalkan'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="px-6 flex flex-wrap gap-2 mb-6">
          {event.tags.map(tag => (
            <Link 
              href={`/events/tag/${tag.name}`} 
              key={tag.id}
              className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 prose prose-lg max-w-none">
        <ReactMarkdown>{event.description || ''}</ReactMarkdown>
      </div>
    </article>
  );
}