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

  // Navbar item animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Mobile menu animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      height: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.nav 
        className={`transition-all duration-300 ${
          scrolled 
            ? 'bg-white/60 backdrop-blur-md mx-4 md:mx-12 mt-2 rounded-full shadow-lg'
            : 'bg-white shadow-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          duration: 0.8 
        }}
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="/images/uch.png"
                    alt="UTY Creative Hub Logo"
                    width={50}
                    height={50}
                    priority
                  />
                </motion.div>
                <motion.div 
                  className="ml-2 text-blue-950 font-bold text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="">UGM</div>
                  <div className="">CREATIVE</div>
                  <div className="">HUB</div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Navigation with staggered animations */}
            <div className="hidden md:flex items-center space-x-8 md:space-x-4 lg:space-x-8">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/program", label: "Program" },
                { href: "/articles", label: "News" },
                { href: "/events", label: "Events" }
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  custom={i}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link 
                    href={item.href} 
                    className="text-gray-700 hover:text-blue-600"
                  >
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Contact Button with animation */}
            <motion.div 
              className="hidden md:flex"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link 
                href="/contact" 
                className={`bg-[#2E417A] text-white px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors flex items-center ${
                  scrolled ? 'py-2.5' : 'py-3'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  <Image
                    src="/lucide/phone.svg"
                    alt="Phone icon"
                    width={18}
                    height={18}
                    className="mr-2"
                  />
                  Contact
                </motion.div>
              </Link>
            </motion.div>

            {/* Mobile menu button with animation */}
            <motion.div 
              className="md:hidden lg:hidden flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
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

      {/* Mobile Menu with animations */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed top-24 left-0 right-0 z-40"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className={`mx-4 md:mx-12 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-200`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-6 space-y-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/program", label: "Program" },
                  { href: "/articles", label: "News" },
                  { href: "/events", label: "Events" }
                ].map((item, i) => (
                  <motion.div
                    key={item.href}
                    variants={menuItemVariants}
                    custom={i}
                  >
                    <Link 
                      href={item.href} 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={menuItemVariants}>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;