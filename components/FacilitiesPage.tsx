"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";

export default function FacilitiesPage() {
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

  // Facilities data - we'll use this to generate our zigzag layout
  const facilities = [
    {
      id: 1,
      title: "THINK TANK ROOM",
      description:
        "Ruangan Ideal untuk Diskusi dan Brainstorming, Mendukung Aktivitas Kolaboratif dengan Fasilitas TV, Papan Tulis, dan Meja Diskusi.",
      imageSrc: "/images/think-tank-room.jpg",
      alt: "Think Tank Room at UTY Creative Hub",
    },
    {
      id: 2,
      title: "PROTOTYPING ROOM",
      description:
        "Ruangan yang Dirancang untuk Pembuatan Prototype dan Pengembangan Project dengan Peralatan dan Area Kerja yang Memadai.",
      imageSrc: "/images/prototyping-room.jpg",
      alt: "Prototyping Room at UTY Creative Hub",
    },
    {
      id: 3,
      title: "COWORKING SPACE",
      description:
        "Area Kerja Bersama yang Nyaman untuk Kolaborasi, Diskusi Kelompok, atau Pengerjaan Tugas dengan Suasana Yang Kondusif.",
      imageSrc: "/images/coworking-space.jpg",
      alt: "Coworking Space at UTY Creative Hub",
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
            Fasilitas Kami
          </motion.h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-2"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto"
          >
            UTY Creative Hub menyediakan berbagai fasilitas modern yang dirancang untuk 
            mendukung kreativitas, inovasi, dan kolaborasi dalam mengembangkan 
            ide-ide brilian menjadi karya nyata.
          </motion.p>
        </div>

        {/* Facilities Cards in Zigzag Layout */}
        <div className="space-y-24">
          {facilities.map((facility, index) => {
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
                key={facility.id}
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
                      src={facility.imageSrc}
                      alt={facility.alt}
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
                        {facility.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 text-lg">
                      {facility.description}
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
            Ingin Menggunakan Fasilitas Kami?
          </h2>
          <p className="text-gray-200 mb-6">
            Jadwalkan kunjungan atau booking ruangan sekarang untuk memulai
            perjalanan kreatif Anda di UTY Creative Hub.
          </p>
          <Link href="https://uchbooking.vercel.app/">
            <motion.button
              className="bg-yellow-400 text-[#2E417A] px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reserve Your Spot
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}