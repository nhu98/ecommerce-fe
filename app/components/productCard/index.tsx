'use client';
import React, { useState } from 'react';
import { Product } from '@/app/components/productCategory';
import Image from 'next/image';
import { HandCoins, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import envConfig from '@/config';
import { addToCart, formatPrice } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/AppProvider';

interface ProductCardProps {
  product: Product;
}

const baseUrl = envConfig.NEXT_PUBLIC_URL;

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
    <div
      className="rounded-lg relative overflow-hidden"
      // onMouseEnter={() => setShowActions(true)}
      // onMouseLeave={() => setShowActions(false)}
    >
      <Link href={`/product-detail?id=${product.id}`}>
        <div
          className={`relative overflow-hidden rounded-t-lg w-full h-56 ${isHovered ? 'scale-105 transition-transform duration-300' : 'scale-100 transition-transform duration-300'}`}
          onMouseEnter={() => setIsHovered(true)} // Bắt sự kiện hover trên ảnh
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
            fill // Sử dụng fill để lấp đầy container
          />
        </div>
      </Link>
      <div className="p-4 relative">
        <h3 className="text-sm font-light cursor-pointer">
          <Link href={`/product-detail?id=${product.id}`}>{product.name}</Link>
        </h3>
        {/*<div*/}
        {/*  className={`flex justify-between items-center mt-2 ${showActions ? 'animate-slideDown' : ''}`}*/}
        {/*>*/}
        {/*{showActions ? (<div className="flex w-full h-10 justify-center">*/}
        {/*    <Dialog open={openDialog} onOpenChange={setOpenDialog}>*/}
        {/*      <DialogTrigger asChild>*/}
        {/*        <Button*/}
        {/*          className="flex text-sm items-center justify-center font-bold w-full bg-red-500 border border-red-500 rounded-lg hover:bg-red-600">*/}
        {/*          <ShoppingCart*/}
        {/*            color={'white'}*/}
        {/*            size={16}*/}
        {/*            className="flex md:mr-2"*/}
        {/*          />*/}
        {/*          <p className="hidden md:flex text-white">Mua ngay</p>*/}
        {/*        </Button>*/}
        {/*      </DialogTrigger>*/}

        {/*      <DialogContent className="">*/}
        {/*        <DialogHeader className="flex justify-center sm:text-center">*/}
        {/*          <DialogTitle className="">{product.name}</DialogTitle>*/}
        {/*          <Description></Description>*/}
        {/*        </DialogHeader>*/}
        {/*        <div className="flex gap-4">*/}
        {/*          <Button*/}
        {/*            onClick={handleBuyNow}*/}
        {/*            className="flex text-sm items-center justify-center font-bold w-full bg-red-500 border rounded-lg hover:bg-red-600"*/}
        {/*          >*/}
        {/*            <HandCoins*/}
        {/*              color={'white'}*/}
        {/*              size={16}*/}
        {/*              className="flex md:mr-2"*/}
        {/*            />*/}
        {/*            <p className="hidden md:flex text-white">Đặt hàng ngay</p>*/}
        {/*          </Button>*/}

        {/*          <Button*/}
        {/*            onClick={handleAddToCart}*/}
        {/*            className="flex text-sm items-center justify-center font-bold w-full bg-gray-100 border rounded-lg hover:bg-gray-300"*/}
        {/*          >*/}
        {/*            <ShoppingCart*/}
        {/*              color={'red'}*/}
        {/*              size={16}*/}
        {/*              className="flex md:mr-2"*/}
        {/*            />*/}
        {/*            <p className="hidden md:flex text-black">Thêm vào giỏ</p>*/}
        {/*          </Button>*/}
        {/*        </div>*/}
        {/*      </DialogContent>*/}
        {/*    </Dialog>*/}
        {/*  </div>) : (<span className="w-full h-10 text-lg font-medium text-red-500">*/}
        {/*    {formatPrice(product.price)}*/}
        {/*  </span>)}*/}
        {/*</div>*/}
        <div className="flex flex-col">
          <span className="w-full h-10 text-lg font-medium text-red-500">
            {formatPrice(product.price)}
          </span>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleBuyNow}
              className="flex text-sm items-center justify-center font-semibold w-full bg-red-500 border rounded-lg hover:bg-red-600"
            >
              <HandCoins color={'white'} size={16} className="flex mr-2" />
              <p className="text-white">Đặt hàng ngay</p>
            </Button>

            <Button
              onClick={handleAddToCart}
              className="flex text-sm items-center justify-center font-semibold w-full bg-gray-100 border rounded-lg hover:bg-gray-300"
            >
              <ShoppingCart color={'red'} size={16} className="flex mr-2" />
              <p className="text-black">Thêm vào giỏ</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
