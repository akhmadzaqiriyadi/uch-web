// components/HeroSection.jsx
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white pt-30 -mb-24 md:pb-36 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content - Text */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2B3674] tracking-tight mb-4">
              UCH
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2B3674] mb-4">
              UTY CREATIVE HUB
            </h2>
            <p className="text-gray-700 text-lg max-w-md">
              Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta! Wadah bagi mahasiswa dan komunitas untuk mengembangkan ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.
            </p>
            <div className="mt-8">
              <button className="bg-[#2B3674] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1e2654] transition-colors">
                Jelajahi Sekarang
              </button>
            </div>
          </div>
          
          {/* Right Content - Image */}
          <div className="w-full md:w-3/4 relative">
            {/* Pattern background - expanded to fill entire right side and bottom */}
            <div className="absolute translate-x-8 md:translate-y-40 md:translate-x-32  inset-0 right-0 bottom-0">
              <Image
                src="/images/pattern-bg.svg"
                alt="Decorative pattern background"
                fill
                className="object-right-bottom"
              />
            </div>
            
            {/* Hand with lightbulb - positioned to align right */}
            <div className="relative translate-x-10 -translate-y-15 md:translate-y-7 md:translate-x-35 w-full h-96 md:h-[550px] z-10">
              <Image
                src="/images/lightbulb-illustration.png"
                alt="Hand holding lightbulb idea illustration"
                fill
                priority
                className="object-contain object-right"
                style={{ objectPosition: 'right center' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}