'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShopDataApiResponse } from '@/schemaValidation/auth.schema';
import { get } from '@/lib/http-client';
import { isValue } from '@/lib/utils';

// const images = Array.from(
//   { length: 5 },
//   (_, i) => `https://picsum.photos/800/400?random=${i}`,
// );

const baseUrl = 'https://qlbh-be.onrender.com';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sliders, setSliders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const result = await get<ShopDataApiResponse>('/shop/get');
        console.log('API Response:', result);

        if (isValue(result)) {
          const sliderData = [
            result.banner1
              ? `${baseUrl}/imgs/shop/${result.banner1}`
              : '/images/no-image.webp',
            result.banner2
              ? `${baseUrl}/imgs/shop/${result.banner2}`
              : '/images/no-image.webp',
            result.banner3
              ? `${baseUrl}/imgs/shop/${result.banner3}`
              : '/images/no-image.webp',
            result.banner4
              ? `${baseUrl}/imgs/shop/${result.banner4}`
              : '/images/no-image.webp',
            result.banner5
              ? `${baseUrl}/imgs/shop/${result.banner5}`
              : '/images/no-image.webp',
          ].filter((img) => img !== '/images/no-image.webp');

          if (sliderData.length === 0) {
            sliderData.push('/images/no-image.webp');
          }

          setSliders(sliderData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  useEffect(() => {
    if (sliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliders]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="relative w-full max-w-4xl rounded-xl mx-auto overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sliders.map((src, index) => (
          <div key={index} className="min-w-full">
            <Image
              src={src}
              alt={`Slide ${index}`}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Nút điều hướng */}
      <button
        onClick={() =>
          setCurrentIndex((currentIndex - 1 + sliders.length) % sliders.length)
        }
        className={`
          absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full ${sliders.length <= 1 ? 'hidden' : ''}
        `}
      >
        ❮
      </button>
      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % sliders.length)}
        className={`
          absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full ${sliders.length <= 1 ? 'hidden' : ''}
        `}
      >
        ❯
      </button>

      {/* Chỉ mục */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliders.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
