import { ArticleWithRelations } from '@/lib/types';
import ArticleCard from './ArticleCard';

export default function ArticleList({ articles }: { articles: ArticleWithRelations[] }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl text-gray-600">Belum ada artikel yang tersedia.</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
