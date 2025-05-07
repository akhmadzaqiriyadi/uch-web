"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";

export default function ProgramsPage() {
  // Animation controls
  const controls = useAnimation();

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Programs data - using the same zigzag layout structure
  const programs = [
    {
      id: 1,
      title: "EXPERT TALK",
      description:
        "Sesi diskusi dan sharing knowledge dari para ahli industri dan akademisi tentang teknologi, inovasi, dan kreativitas. Program ini memberikan insight langsung dari praktisi yang berpengalaman di bidangnya.",
      imageSrc: "/images/expert-talk.jpg",
      alt: "Expert Talk at UTY Creative Hub",
    },
    {
      id: 2,
      title: "UCAST",
      description:
        "Podcast inovatif yang membahas berbagai topik seputar teknologi, startup, inovasi, dan kreativitas. UCast menghadirkan pembicara inspiratif yang berbagi pengalaman dan wawasan melalui format audio yang menarik dan edukatif.",
      imageSrc: "/images/ucast-podcast.jpg",
      alt: "UCast Podcast by UTY Creative Hub",
    },
    {
      id: 3,
      title: "KONSOLIDASI PKM",
      description:
        "Program pendampingan yang dirancang untuk membantu mahasiswa mengembangkan dan menyempurnakan proposal Program Kreativitas Mahasiswa (PKM) dengan bimbingan mentor berpengalaman dan workshop tematik.",
      imageSrc: "/images/konsolidasi-pkm.jpg",
      alt: "PKM Consolidation Program at UTY Creative Hub",
    },
    {
      id: 4,
      title: "STARTUP INCUBATION",
      description:
        "Program inkubasi startup yang menyediakan mentoring bisnis, akses ke jaringan investor, pelatihan kewirausahaan, dan ruang kerja bagi mahasiswa yang ingin mengembangkan ide bisnisnya menjadi startup yang viable.",
      imageSrc: "/images/startup-incubation.jpg",
      alt: "Startup Incubation Program at UTY Creative Hub",
    },
    {
      id: 5,
      title: "BOOTCAMP TEKNOLOGI",
      description:
        "Pelatihan intensif dengan materi praktis tentang berbagai teknologi terkini seperti AI, IoT, mobile app development, dan UI/UX design. Program ini dirancang untuk membekali mahasiswa dengan skills yang diminati industri.",
      imageSrc: "/images/tech-bootcamp.jpg",
      alt: "Technology Bootcamp at UTY Creative Hub",
    }
  ];

  return (
    <section className="pt-32 pb-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-[#2E417A]"
          >
            Program Kami
          </motion.h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-2"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto"
          >
            UTY Creative Hub menawarkan berbagai program menarik untuk mengembangkan
            bakat, kreativitas, dan inovasi mahasiswa dalam menghadapi tantangan masa depan.
          </motion.p>
        </div>

        {/* Programs Cards in Zigzag Layout */}
        <div className="space-y-24">
          {programs.map((program, index) => {
            const [ref, inView] = useInView({
              threshold: 0.25,
              triggerOnce: true,
            });

            // Determine if this card should be displayed on the left or right
            const isEven = index % 2 === 0;

            // Animation direction based on card position
            const cardAnimation = {
              hidden: { opacity: 0, x: isEven ? -50 : 50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            };

            const imageAnimation = {
              hidden: { opacity: 0, x: isEven ? 50 : -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            };

            return (
              <div
                key={program.id}
                ref={ref}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12`}
              >
                {/* Image Section */}
                <motion.div
                  className="w-full lg:w-1/2 rounded-lg overflow-hidden shadow-xl"
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={imageAnimation}
                >
                  <div className="relative h-[300px] md:h-[400px] w-full">
                    <Image
                      src={program.imageSrc}
                      alt={program.alt}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </motion.div>

                {/* Text Section */}
                <motion.div
                  className="w-full lg:w-1/2"
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={cardAnimation}
                >
                  <div className={`${isEven ? "lg:pl-8" : "lg:pr-8"}`}>
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-16 bg-[#2E417A] mr-4"></div>
                      <h2 className="text-3xl font-bold text-[#2E417A]">
                        {program.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 text-lg">
                      {program.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-24 text-center p-8 bg-[#2E417A] rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Tertarik Bergabung dalam Program Kami?
          </h2>
          <p className="text-gray-200 mb-6">
            Daftarkan diri Anda sekarang dan mulai perjalanan pengembangan diri yang 
            menyenangkan bersama UTY Creative Hub.
          </p>
          <Link href="/events">
            <motion.button
              className="bg-yellow-400 text-[#2E417A] px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}