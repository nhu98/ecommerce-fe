'use client';
import { PulsatingButton } from '@/components/magicui/pulsating-btn';
import CallMeIcon from '@/app/components/icons/call-me';
import React, { useState } from 'react';
import ZaloIcon from '@/app/components/icons/zalo';
import { usePathname } from 'next/navigation';

export const CallZaloButton = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
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
          <div
            className={`flex flex-col md:flex-row items-center gap-1 ${show ? 'block' : 'hidden'}`}
          >
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
              // href="tel:+84962486085"
              onClick={() => setShow(!show)}
              className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-300  transition"
            >
              <CallMeIcon />
            </a>
          </PulsatingButton>
        </div>
      </div>
    </>
  );
};
