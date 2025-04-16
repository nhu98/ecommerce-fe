'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Description } from '@radix-ui/react-dialog';

interface ImageProps {
  images: string[];
}

export default function ProductThumbnail({ images }: ImageProps) {
  const [selectedImage, setSelectedImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      console.log('images', images);
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleSelect = (index: number) => {
    if (images[index] === '/images/no-image.webp') return;
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  const nextImage = () => {
    if (images[currentIndex + 1] === '/images/no-image.webp') return;
    const newIndex = (currentIndex + 1) % images.length;
    handleSelect(newIndex);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    handleSelect(newIndex);
  };

  console.log('selectedImage', selectedImage);

  return (
    <div className="flex flex-col items-center space-y-4 w-full md:w-fit">
      {/* Ảnh Chính */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full max-w-md cursor-pointer">
            <Image
              src={selectedImage || '/images/no-image.webp'}
              alt="Product Image"
              width={500}
              height={500}
              className="w-full h-auto rounded-lg"
              unoptimized
            />
          </div>
        </DialogTrigger>
        {/* Modal */}
        <DialogContent className="flex flex-col items-center bg-transparent border-0 shadow-none p-0">
          <DialogTitle className="m-4"></DialogTitle>
          <Description></Description>
          {/* Ảnh lớn */}
          <Image
            src={selectedImage || '/images/no-image.webp'}
            width={300}
            height={300}
            alt="Full Image"
            className="w-full h-auto rounded-lg object-cover"
            unoptimized
          />
          {/* Nút chuyển hình */}
          <div className="absolute top-1/2 flex w-full justify-between mt-4">
            <button
              onClick={prevImage}
              className="p-2 bg-gray-300 opacity-50 hover:opacity-100 rounded-full"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextImage}
              className="p-2 bg-gray-300 opacity-50 hover:opacity-100 rounded-full"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ảnh Nhỏ */}
      <div className="flex items-center justify-center space-x-2">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            width={80}
            height={80}
            className={`w-11 h-11 md:w-20 md:h-20 rounded-lg cursor-pointer border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => handleSelect(index)}
            unoptimized
          />
        ))}
      </div>
    </div>
  );
}
