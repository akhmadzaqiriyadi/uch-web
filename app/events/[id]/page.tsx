import { getEventById } from '@/lib/events';
import EventContent from '@/components/EventContent';
import Link from 'next/link';
import type { Metadata } from 'next';

// Generate metadata dinamis berdasarkan event
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  
  return {
    title: `${event.title} - CMS Kampus`,
    description: event.description?.substring(0, 155) || 'Detail acara dari komunitas kampus'
  };
}

export default async function EventPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const event = await getEventById(id);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/events" className="text-blue-600 hover:underline">
          &larr; Kembali ke daftar acara
        </Link>
      </div>
      
      <EventContent event={event} />
    </main>
  );
}