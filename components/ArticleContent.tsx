import Image from 'next/image';
import Link from 'next/link';
import { ArticleWithRelations } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

export default function ArticleContent({ article }: { article: ArticleWithRelations }) {
  return (
    <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          {article.author && (
            <div className="flex items-center mr-4">
              {article.author.avatar_url && (
                <Image 
                  src={article.author.avatar_url} 
                  alt={article.author.full_name} 
                  width={32} 
                  height={32} 
                  className="rounded-full mr-2"
                />
              )}
              <span>{article.author.full_name}</span>
            </div>
          )}
          <time dateTime={article.created_at}>
            {new Date(article.created_at).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </time>
        </div>
      </div>
      
      {/* Featured Image */}
      {article.image_url && (
        <div className="relative h-72 w-full mb-6">
          <Image 
            src={article.image_url} 
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}
      
      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="px-6 flex flex-wrap gap-2 mb-6">
          {article.tags.map(tag => (
            <Link 
              href={`/articles/tag/${tag.name}`} 
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
        <ReactMarkdown>{article.content || ''}</ReactMarkdown>
      </div>
    </article>
  );
}
