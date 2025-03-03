'use client';
import React, { useEffect, useState } from 'react';
import Banner from '@/app/components/banner';
import { ArrowUpToLine } from 'lucide-react';
import MainContent from '@/app/components/main-contain';

export default function Home() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <Banner />
        <MainContent />
      </div>
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 p-2 rounded-full shadow-lg hover:bg-gray-300 transition"
          aria-label="Scroll to Top"
        >
          <ArrowUpToLine size={32} />
        </button>
      )}
    </div>
  );
}
