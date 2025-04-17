import { getArticlesByTag, getAllTags } from '@/lib/articles';
import ArticleList from '@/components/ArticleList';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

// Generate metadata dinamis berdasarkan tag
export async function generateMetadata({ params }: { params: { tagName: string } }): Promise<Metadata> {
  const { tagName } = await params;
  const decodedTagName = decodeURIComponent(tagName);

  return {
    title: `Artikel dengan Tag: ${decodedTagName} - CMS Kampus`,
    description: `Kumpulan artikel dengan tag ${decodedTagName} dari komunitas kampus`,
  };
}

// Pre-render halaman tag yang ada
export async function generateStaticParams() {
  try {
    const tags = await getAllTags();

    return tags.map((tag) => ({
      tagName: encodeURIComponent(tag.name),
    }));
  } catch (error) {
    console.error('Error generating tag static params:', error);
    return [];
  }
}

export default async function TagArticlesPage({ params }: { params: { tagName: string } }) {
  const { tagName } = await params;
  const decodedTagName = decodeURIComponent(tagName);

  try {
    const articles = await getArticlesByTag(decodedTagName);

    if (articles.length === 0) {
      notFound();
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tag: {decodedTagName}</h1>
          <p className="text-gray-600 mb-4">
            Menampilkan {articles.length} artikel dengan tag ini
          </p>
          <Link href="/articles" className="text-blue-600 hover:underline">
            Kembali ke semua artikel
          </Link>
        </div>

        <ArticleList articles={articles} />
      </main>
    );
  } catch (error) {
    console.error(`Error in tag page for ${decodedTagName}:`, error);
    notFound();
  }
}
