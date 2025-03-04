'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Banner from '@/app/components/banner';
import { ArrowUpToLine } from 'lucide-react';
import MainContent from '@/app/components/main-contain';

export default function Home() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleScroll = useCallback(() => {
    setShowScrollToTop(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <div className="mx-4 my-8 overflow-x-hidden md:mx-8">
        <Banner />
        <MainContent />
      </div>
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-300"
          aria-label="Scroll to Top"
        >
          <ArrowUpToLine size={32} />
        </button>
      )}
    </div>
  );
}
