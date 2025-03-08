'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Banner from '@/app/components/banner';
import { ArrowUpToLine } from 'lucide-react';
import MainContent from '@/app/components/main-contain';
import { PulsatingButton } from '@/components/magicui/pulsating-btn';
import CallMeIcon from '@/app/components/icons/call-me';
import ZaloIcon from '@/app/components/icons/zalo';

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
      <div className="mx-4 my-2 md:my-8 overflow-x-hidden md:mx-8">
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
      <div className="fixed bottom-28 right-4 flex flex-col">
        <div className="flex justify-end">
          <PulsatingButton>
            <a
              href="https://zalo.me/0962486085"
              className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-300  transition"
            >
              <ZaloIcon className="w-24 h-24" />
            </a>
          </PulsatingButton>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col md:flex-row items-center gap-1">
            <a
              href="tel:+84962486085"
              className="rounded-full bg-black opacity-50 text-white p-2 hover:bg-gray-500  transition"
            >
              <span>096.2486.085(Huy)</span>
            </a>

            <a
              href="tel:+84974550638"
              className="rounded-full bg-black opacity-50 text-white p-2 hover:bg-gray-500  transition"
            >
              <span>0974.550.638(Giang)</span>
            </a>
          </div>

          <PulsatingButton>
            <a
              href="tel:+84962486085"
              className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-300  transition"
            >
              <CallMeIcon />
            </a>
          </PulsatingButton>
        </div>
      </div>
    </div>
  );
}
