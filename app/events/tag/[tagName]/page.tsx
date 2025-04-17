import { getEventsByTag, getAllEventTags } from '@/lib/events';
import EventList from '@/components/EventList';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

// Generate metadata dinamis berdasarkan tag
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ tagName: string }> 
}): Promise<Metadata> {
  const { tagName } = await params;
  const decodedTagName = decodeURIComponent(tagName);

  return {
    title: `Acara dengan Tag: ${decodedTagName} - CMS Kampus`,
    description: `Kumpulan acara dengan tag ${decodedTagName} dari komunitas kampus`,
  };
}

// Pre-render halaman tag yang ada
export async function generateStaticParams() {
  try {
    const tags = await getAllEventTags();

    return tags.map((tag) => ({
      tagName: encodeURIComponent(tag.name),
    }));
  } catch (error) {
    console.error('Error generating event tag static params:', error);
    return [];
  }
}

export default async function TagEventsPage({ 
  params 
}: { 
  params: Promise<{ tagName: string }> 
}) {
  const { tagName } = await params;
  const decodedTagName = decodeURIComponent(tagName);

  try {
    const events = await getEventsByTag(decodedTagName);

    if (events.length === 0) {
      notFound();
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tag: {decodedTagName}</h1>
          <p className="text-gray-600 mb-4">
            Menampilkan {events.length} acara dengan tag ini
          </p>
          <Link href="/events" className="text-blue-600 hover:underline">
            Kembali ke semua acara
          </Link>
        </div>

        <EventList events={events} />
      </main>
    );
  } catch (error) {
    console.error(`Error in tag page for ${decodedTagName}:`, error);
    notFound();
  }
}