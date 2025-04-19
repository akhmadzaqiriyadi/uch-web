'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { 
        duration: 0.8 
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`transition-all duration-300 ${
          scrolled 
            ? 'bg-white/60 backdrop-blur-md mx-4 md:mx-12 mt-2 rounded-full shadow-lg'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className={`container mx-auto px-4 ${scrolled ? 'px-6' : ''}`}>
          <div className="flex justify-between items-center h-20">
            {/* Logo with animation */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>

            {/* Desktop Navigation with staggered animation */}
            <div className="hidden md:flex items-center space-x-8 md:space-x-4 lg:space-x-8">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Program', href: '/program' },
                { name: 'News', href: '/articles' },
                { name: 'Events', href: '/events' }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  custom={index}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link href={item.href} className="text-gray-700 hover:text-blue-600 relative group">
                    {item.name}
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full"
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Contact Button with hover animation */}
            <motion.div 
              className="hidden md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
              </motion.div>
            </motion.div>

            {/* Mobile menu button with animation */}
            <motion.div 
              className="md:hidden lg:hidden flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="outline-none mobile-menu-button"
                onClick={toggleMenu}
                whileTap={{ scale: 0.9 }}
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
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed top-24 left-0 right-0 z-40"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={`mx-4 md:mx-12 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-200`}>
              <div className="px-4 py-6 space-y-4">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Program', href: '/program' },
                  { name: 'News', href: '/articles' },
                  { name: 'Events', href: '/events' }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link 
                      href={item.href} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
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
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;