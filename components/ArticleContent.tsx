"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArticleWithRelations } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

export default function ArticleContent({ article }: { article: ArticleWithRelations }) {
  // Calculate reading time (rough estimate)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime > 0 ? readingTime : 1;
  };

  const readingTime = calculateReadingTime(article.content || '');
  
  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="pb-16 pt-24 lg:py-24  bg-[#2E417A]">
      <div className="container mx-auto px-4">
        <motion.article 
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
        >
          {/* Featured Image Banner */}
          {article.image_url && (
            <motion.div 
              className="relative h-64 md:h-96 w-full"
              variants={itemAnimation}
            >
              <Image 
                src={article.image_url} 
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Badge overlay - Article */}
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-[#2E417A] px-4 py-2 rounded-full font-semibold text-sm uppercase tracking-wider">
                  Artikel
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Header */}
          <motion.div className="p-8" variants={itemAnimation}>
            {/* Back to Articles link */}
            <Link href="/articles" className="inline-flex items-center text-[#2E417A] font-medium mb-6 hover:text-[#1E3169] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Artikel
            </Link>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 text-[#2E417A]"
              variants={itemAnimation}
            >
              {article.title}
            </motion.h1>
            
            <div className="w-20 h-1 bg-yellow-400 mb-6"></div>
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                variants={itemAnimation}
              >
                {article.tags.map(tag => (
                  <Link 
                    href={`/articles/tag/${tag.name}`} 
                    key={tag.id}
                    className="text-sm bg-[#2E417A]/10 text-[#2E417A] px-3 py-1 rounded-full hover:bg-[#2E417A]/20 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </motion.div>
            )}
            
            {/* Author and Date */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-t border-b border-gray-100"
              variants={itemAnimation}
            >
              {article.author && (
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#2E417A]" />
                  <div className="flex items-center">
                    {article.author.avatar_url && (
                      <div className="relative w-8 h-8 mr-3">
                        <Image 
                          src={article.author.avatar_url} 
                          alt={article.author.full_name} 
                          fill
                          className="rounded-full object-cover border-2 border-yellow-400"
                        />
                      </div>
                    )}
                    <span className="font-medium">{article.author.full_name}</span>
                  </div>
                </div>
              )}
              
              <time className="flex items-center sm:ml-auto" dateTime={article.created_at}>
                <Calendar className="w-5 h-5 mr-2 text-[#2E417A]" />
                {new Date(article.created_at).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </time>
            </motion.div>
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="p-8 prose prose-lg max-w-none"
            variants={itemAnimation}
          >
            <div className="prose prose-lg prose-headings:text-[#2E417A] prose-a:text-[#2E417A] prose-a:no-underline hover:prose-a:text-yellow-600 prose-blockquote:border-l-yellow-400 prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:not-italic prose-strong:text-[#2E417A]">
              <ReactMarkdown>{article.content || ''}</ReactMarkdown>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div 
            className="p-8 bg-gray-50 border-t border-gray-100"
            variants={itemAnimation}
          >
            {/* Share links or related articles could be here */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-600">
                <span className="font-medium text-[#2E417A]">Bagikan artikel:</span>
                <div className="flex gap-3 mt-2">
                  {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((platform) => (
                    <motion.button 
                      key={platform}
                      className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">Share on {platform}</span>
                      <div className="w-5 h-5 text-[#2E417A]">
                        {/* Placeholder for icon */}
                        <span className="text-xs">{platform[0]}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}