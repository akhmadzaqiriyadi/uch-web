"use client";

import { ArticleWithRelations } from '@/lib/types';
import ArticleCard from './ArticleCard';
import { motion } from "framer-motion";

export default function ArticleList({ articles }: { articles: ArticleWithRelations[] }) {
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (!articles || articles.length === 0) {
    return (
      <motion.div 
        className="text-center py-10"
        variants={itemAnimation}
      >
        <h3 className="text-xl text-gray-200">Belum ada artikel yang tersedia.</h3>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          variants={itemAnimation}
          custom={index}
        >
          <ArticleCard article={article} />
        </motion.div>
      ))}
    </div>
  );
}