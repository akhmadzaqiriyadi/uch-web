import { getPublishedArticles } from '../../lib/articles';
import ArticleList from '@/components/ArticleList';

export const metadata = {
  title: 'Artikel - CMS Kampus',
  description: 'Kumpulan artikel terbaru dari komunitas kampus'
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Artikel Terbaru</h1>
      <ArticleList articles={articles} />
    </main>
  );
}