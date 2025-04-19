'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav 
        className={`transition-all duration-300 ${
          scrolled 
            ? 'bg-white/60 backdrop-blur-md mx-4 md:mx-12 mt-2 rounded-full shadow-lg'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className={`container mx-auto px-4 ${scrolled ? 'px-6' : ''}`}>
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/uch.png"
                  alt="UTY Creative Hub Logo"
                  width={50}
                  height={50}
                  priority
                />
                <div className="ml-2 text-blue-950 font-bold text-xs">
                  <div className="">UGM</div>
                  <div className="">CREATIVE</div>
                  <div className="">HUB</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                About Us
              </Link>
              <Link href="/program" className="text-gray-700 hover:text-blue-600">
                Program
              </Link>
              <Link href="/articles" className="text-gray-700 hover:text-blue-600">
                News
              </Link>
              <Link href="/events" className="text-gray-700 hover:text-blue-600">
                Events
              </Link>
            </div>

            {/* Contact Button */}
            <div className="hidden md:flex">
              <Link 
                href="/contact" 
                className={`bg-[#2E417A] text-white px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors flex items-center ${
                  scrolled ? 'py-2.5' : 'py-3'
                }`}
              >
                <Image
                  src="/lucide/phone.svg"
                  alt="Phone icon"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Contact
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                className="outline-none mobile-menu-button"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Separate from main nav */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-24 left-0 right-0 z-40">
          <div className={`mx-4 md:mx-12 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-200`}>
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/program" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Program
              </Link>
              <Link 
                href="/articles" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link 
                href="/events" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center px-4 py-2 bg-[#2E417A] text-white rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src="/lucide/phone.svg"
                  alt="Phone icon"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;