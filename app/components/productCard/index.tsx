'use client';
import React, { useState } from 'react';
import { Product } from '@/app/components/productCategory';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { addToCart, formatPrice } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/AppProvider';

interface ProductCardProps {
  product: Product;
}

const baseUrl = 'http://14.225.206.204:3001';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { isActioned, setIsActioned } = useAppContext();

  // const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // const [openDialog, setOpenDialog] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Thành công',
      description: `Đã thêm vào giỏ hàng sản phẩm: ${product.name}`,
      duration: 3000,
      variant: 'success',
    });
    // setOpenDialog(false);
    setIsActioned(!isActioned);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="rounded-lg relative overflow-hidden">
      <Link href={`/product-detail?id=${product.id}`}>
        <div
          className={`relative overflow-hidden rounded-t-lg w-full h-56 ${isHovered ? 'scale-105 transition-transform duration-300' : 'scale-100 transition-transform duration-300'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={
              product.image
                ? `${baseUrl}/imgs/products/${product.image}`
                : '/images/no-image.webp'
            }
            alt={product.name}
            sizes={'(max-width: 768px) 100vw, 50vw'}
            className="cursor-pointer object-cover"
            fill
          />
        </div>
      </Link>
      <div className="p-4 relative">
        <h3 className="text-sm font-light cursor-pointer break-words h-10 overflow-hidden">
          <Link
            href={`/product-detail?id=${product.id}`}
            className="line-clamp-2"
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex flex-col">
          <span className="w-full h-10 text-lg font-medium text-red-500 break-words overflow-hidden">
            <span className="line-clamp-2">{formatPrice(product.price)}</span>
          </span>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleBuyNow}
              className="flex text-sm items-center justify-center font-semibold w-full bg-red-500 border rounded-lg hover:bg-red-600"
            >
              <p className="text-sm text-white">Đặt hàng ngay</p>
            </Button>

            <Button
              onClick={handleAddToCart}
              className="flex text-sm items-center justify-center font-semibold w-full bg-orange-500 border rounded-lg hover:bg-orange-600"
            >
              <p className="text-sm text-white">Thêm vào giỏ</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
