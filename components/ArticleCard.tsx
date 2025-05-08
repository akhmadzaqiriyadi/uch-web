"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { ArticleWithRelations } from '@/lib/types';
import { motion } from "framer-motion";

export default function ArticleCard({ article }: { article: ArticleWithRelations }) {
  return (
    <motion.article 
      className="rounded-3xl overflow-hidden bg-white shadow hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="relative"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      >
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
        <motion.div 
          className="absolute bottom-2 left-2 right-2 bg-opacity-40"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white line-clamp-2">{article.title}</h2>
        </motion.div>
      </motion.div>

      <div className="p-4">
        {/* Author and Date with icons */}
        <motion.div 
          className="space-y-3 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center text-slate-500"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Calendar className="w-5 h-5 mr-2" color="#2E417A" />
            <span>
              Tanggal: {new Date(article.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </motion.div>

          {article.author && (
            <motion.div 
              className="flex items-center text-slate-500"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
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
            </motion.div>
          )}
        </motion.div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <motion.div 
            className="mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {article.tags.map((tag, index) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
              >
                <Link
                  href={`/articles/tag/${tag.name}`}
                  className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200 mr-2 inline-block"
                >
                  #{tag.name}
                </Link>
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Detail button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <Link href={`/articles/${article.slug}`}>
            <motion.div
              className="w-full mt-4 flex items-center justify-center text-center py-3 bg-[#2E417A] text-white rounded-xl hover:bg-blue-950 transition-colors"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
              }}
              whileTap={{ scale: 0.97 }}
            >
              Baca Selengkapnya
              <div>
                <ArrowRight className="ml-2 h-5 w-5 -rotate-45" />
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}