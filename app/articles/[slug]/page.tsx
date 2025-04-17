import { getArticleBySlug, getPublishedArticles } from '@/lib/articles';
import ArticleContent from '@/components/ArticleContent';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Generate metadata dinamis berdasarkan artikel
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }
  
  return {
    title: `${article.title} - CMS Kampus`,
    description: article.content?.substring(0, 160) || 'Baca artikel lengkap di CMS Kampus'
  };
}

// Pre-render halaman artikel yang ada
export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article || article.status !== 'published') {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <ArticleContent article={article} />
    </main>
  );
}