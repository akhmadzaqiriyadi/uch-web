import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-white pt-32 lg:pt-64 -mb-24 md:pb-36 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content - Text */}
          <div className="w-full md:w-1/2 mb-64 lg:mb-32 z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2B3674] tracking-tight mb-4">
              UCH
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2B3674] mb-4">
              UTY CREATIVE HUB
            </h2>
            <p className="text-gray-700 text-lg max-w-md">
              Pusat kreativitas dan inovasi resmi Universitas Teknologi
              Yogyakarta! Wadah bagi mahasiswa dan komunitas untuk mengembangkan
              ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.
            </p>
            <div className="mt-8">
              <button className="bg-[#2B3674] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1e2654] transition-colors">
                Jelajahi Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Background */}
      <div className="absolute right-0 bottom-0 w-full md:w-[80%] lg:w-[60%]  h-[500px] md:h-[600px] z-0">
        <Image
          src="/images/pattern-bg.svg"
          alt="Decorative pattern background"
          fill
          className="object-contain object-bottom"
        />
      </div>

      {/* Hand Image (melekat ke kanan) */}
      <div className="absolute lg:bottom-20 bottom-0 right-0 w-full md:h-[600px] z-10 h-[550px]">
        <Image
          src="/images/lightbulb-illustration.png"
          alt="Hand holding lightbulb idea illustration"
          fill
          priority
          className="object-contain object-right-bottom md:max-w-[70%]  lg:max-w-[60%] max-w-[85%]  ml-auto"
        />
      </div>
    </section>
  );
}
