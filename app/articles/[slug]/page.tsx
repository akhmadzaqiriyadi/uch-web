import { getArticleBySlug, getPublishedArticles } from '@/lib/articles';
import { Metadata } from 'next';
import ArticleContent from '@/components/ArticleContent';
import { notFound } from 'next/navigation';

// Generate metadata dynamically based on the article
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  // Await params before accessing its properties
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }
  
  return {
    title: `${article.title} - CMS Kampus`,
    description: article.content?.substring(0, 160) || 'Baca artikel lengkap di CMS Kampus',
  };
}

// Article detail page
export default async function ArticleDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Await params before accessing its properties
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article || article.status !== 'published') {
    notFound();
  }
  
  return (
      <ArticleContent article={article} />
  );
}