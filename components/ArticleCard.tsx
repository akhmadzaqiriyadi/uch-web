import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { ArticleWithRelations } from '@/lib/types';

export default function ArticleCard({ article }: { article: ArticleWithRelations }) {
  return (
    <article className="rounded-3xl overflow-hidden bg-white shadow hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {article.image_url && (
          <div className="relative bg-black h-60 w-full">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover opacity-60"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Title overlay on image */}
        <div className="absolute bottom-2 left-2 right-2 bg-opacity-40">
          <h2 className="text-xl font-bold text-white line-clamp-2">{article.title}</h2>
        </div>
      </div>

      <div className="p-4">
        {/* Author and Date with icons */}
        <div className="space-y-3 py-2">
          <div className="flex items-center text-slate-500">
            <Calendar className="w-5 h-5 mr-2" color="#2E417A" />
            <span>
              Tanggal: {new Date(article.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {article.author && (
            <div className="flex items-center text-slate-500">
              {article.author.avatar_url && (
                <Image
                  src={article.author.avatar_url}
                  alt={article.author.full_name}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              )}
              <span>Penulis: {article.author.full_name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-3">
            {article.tags.map((tag) => (
              <Link
                href={`/articles/tag/${tag.name}`}
                key={tag.id}
                className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200 mr-2"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Detail button */}
        <Link
          href={`/articles/${article.slug}`}
          className="w-full mt-4 flex items-center justify-center text-center py-3 bg-[#2E417A] text-white rounded-xl hover:bg-blue-800 transition-colors"
        >
          Baca Selengkapnya
          <ArrowRight className="ml-2 h-5 w-5 -rotate-45" />
        </Link>
      </div>
    </article>
  );
}