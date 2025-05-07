'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import { EventWithRelations } from '@/lib/types';

type EventsSectionProps = {
    events: EventWithRelations[];
    title?: string;
    viewAllLink?: string;
    limit?: number;
  };

const EventsSection = ({ events, title = "Acara Mendatang", viewAllLink = "/events", limit = 3 }: EventsSectionProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Display limited events
  const displayedEvents = events?.slice(0, limit) || [];

  return (
    <motion.section 
      className="mb-16 py-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={titleVariants}
        >
          <h2 className="text-3xl font-bold text-[#2B3674]">{title}</h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={viewAllLink} className="bg-white text-[#2B3674] hover:bg-blue-50 border border-[#2B3674] px-4 py-2 rounded-lg transition-colors flex items-center">
              Lihat Semua
            </Link>
          </motion.div>
        </motion.div>

        {displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                variants={cardVariants}
                custom={index}
                className="h-full"
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-gray-50 rounded-lg shadow-sm"
            variants={cardVariants}
          >
            <h3 className="text-xl text-gray-600">
              Belum ada acara mendatang.
            </h3>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default EventsSection;