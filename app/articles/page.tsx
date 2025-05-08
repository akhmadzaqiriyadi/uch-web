import { getPublishedArticles } from '../../lib/articles';
import ArticleList from '@/components/ArticleList';

export const metadata = {
  title: 'Artikel - UTY Creative Hub',
  description: 'Kumpulan artikel terbaru dari komunitas UTY Creative Hub'
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  
  return (
    <section className="pt-32 pb-8 lg:pt-36 lg:pb-32 bg-[#2E417A] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Artikel Terbaru
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-2"></div>
        </div>

        <ArticleList articles={articles} />
      </div>
    </section>
  );
}