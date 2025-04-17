import Image from 'next/image';
import Link from 'next/link';
import { ArticleWithRelations } from '@/lib/types';

export default function ArticleCard({ article }: { article: ArticleWithRelations }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {article.image_url && (
        <div className="relative h-48 w-full">
          <Image 
            src={article.image_url} 
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h2>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          {article.author && (
            <>
              {article.author.avatar_url && (
                <Image 
                  src={article.author.avatar_url} 
                  alt={article.author.full_name} 
                  width={24} 
                  height={24} 
                  className="rounded-full mr-2"
                />
              )}
              <span className="mr-3">{article.author.full_name}</span>
            </>
          )}
          <span>{new Date(article.created_at).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</span>
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(tag => (
              <Link 
                href={`/articles/tag/${tag.name}`} 
                key={tag.id}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
        
        <Link 
          href={`/articles/${article.slug}`}
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </article>
  );
}
