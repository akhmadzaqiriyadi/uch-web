"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const floatingAnimation = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative bg-white pt-32 lg:pt-64 -mb-24 md:pb-36 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content - Text with animations */}
          <motion.div
            className="w-full md:w-1/2 mb-72 lg:mb-32 z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-[#2B3674] tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              UCH
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-[#2B3674] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              UTY CREATIVE HUB
            </motion.h2>
            <motion.p
              className="text-gray-700 text-lg max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Pusat kreativitas dan inovasi resmi Universitas Teknologi
              Yogyakarta! Wadah bagi mahasiswa dan komunitas untuk mengembangkan
              ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.
            </motion.p>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.button
                className="bg-[#2B3674] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1e2654] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Jelajahi Sekarang
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Pattern Background with animation */}
      <motion.div
        className="absolute right-0 bottom-0 w-full md:w-[80%] lg:w-[60%] h-[500px] md:h-[600px] z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Image
          src="/images/pattern-bg.svg"
          alt="Decorative pattern background"
          fill
          className="object-contain object-bottom"
        />
      </motion.div>

      {/* Hand Image with lightbulb animation */}
      <motion.div
        className="absolute lg:bottom-20 bottom-0 right-0 w-full md:h-[600px] z-10 h-[550px]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
      >
        <motion.div
          className="w-full h-full relative"
          variants={floatingAnimation}
          animate="float"
        >
          <Image
            src="/images/lightbulb-illustration.png"
            alt="Hand holding lightbulb idea illustration"
            fill
            priority
            className="object-contain object-right-bottom md:max-w-[70%] lg:max-w-[60%] max-w-[85%] ml-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
