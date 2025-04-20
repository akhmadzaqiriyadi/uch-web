// components/AboutUsSection.jsx
"use client";
import { useRef, useEffect } from 'react';
import { motion } from "framer-motion";

export default function AboutUsSection() {
  const videoRef = useRef(null);

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Extract the file ID from the Google Drive URL
  const driveFileId = "1GH0L5z2pNL29ECYQaUaAEsXwN5tC67Cd";
  // Create the embed URL
  const driveEmbedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;

  return (
    <section className="pt-32 pb-8 lg:pt-44 lg:pb-32 bg-[#2E417A] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            About Us
          </motion.h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-2"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - About Us Text */}
          <motion.div 
            className="w-full lg:w-1/2"
            variants={containerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={itemAnimation}
              className="text-3xl font-bold text-white mb-6"
            >
              UTY Creative Hub
            </motion.h2>
            
            <motion.p variants={itemAnimation} className="text-gray-200 mb-6 text-lg">
              Selamat datang di UTY Creative Hub, pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta! Kami adalah wadah yang dirancang khusus untuk mahasiswa dan komunitas UTY dalam mengembangkan ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.
            </motion.p>
            
            <motion.p variants={itemAnimation} className="text-gray-200 mb-6 text-lg">
              Dengan fasilitas modern dan program-program yang inspiratif, UTY Creative Hub menjadi rumah bagi para pemikir kreatif, inovator muda, dan calon pemimpin masa depan yang ingin membuat perubahan positif melalui karya-karya inovatif.
            </motion.p>
            
            <motion.div variants={itemAnimation}>
              <motion.button
                className="bg-yellow-400 text-[#2E417A] px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Kenal Lebih Dekat
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Right side - Video Profile */}
          <motion.div 
            className="w-full lg:w-1/2 relative overflow-hidden rounded-lg shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-w-16 aspect-h-10">
              <iframe 
                className="w-full h-[300px] md:h-[400px] rounded-lg"
                src={driveEmbedUrl}
                title="UTY Creative Hub Profile Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}