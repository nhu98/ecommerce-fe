'use client';
import React, { useEffect, useState } from 'react';
import QuantityEdit from '@/app/components/quantity-edit';
import ProductThumbnail from '@/app/components/product-thumbnail';
import { HandCoins, ShoppingCart } from 'lucide-react';
import ProductCategory from '@/app/components/productCategory';
import { useRouter, useSearchParams } from 'next/navigation';
import { get } from '@/lib/http-client';
import { ProductResponse } from '@/schemaValidation/auth.schema';
import LoaderComponent from '@/app/components/loader';
import { addToCart, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/app/AppProvider';

const baseUrl = 'https://be.sondiennuoc.vn';

export default function ProductDetail() {
  const router = useRouter();
  const { isActioned, setIsActioned } = useAppContext();

  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductResponse>();

  const [currentQuantity, setCurrentQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    get<ProductResponse>('/product/getById', { id: productId })
      .then((result) => {
        if (result?.id) setProduct(result);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleQuantityChange = (quantity: number) => {
    setCurrentQuantity(quantity);
  };

  const handleAddToCart = () => {
    const productCart = {
      id: product?.id || '',
      name: product?.name || '',
      price: product?.price || 0,
      image: product?.img1 || '',
    };
    addToCart(productCart, currentQuantity);
    toast({
      title: 'Thành công',
      description: `Đã thêm vào giỏ hàng sản phẩm: ${product?.name}`,
      duration: 3000,
      variant: 'success',
    });
    setIsActioned(!isActioned);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="container mx-auto px-4 min-h-[80vh]">
      <div className="bg-gray-100 py-1 px-2 flex flex-col justify-center mb-4">
        <h2 className="text-xl font-semibold">Chi tiết sản phẩm</h2>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex justify-center md:w-1/2">
          <ProductThumbnail
            images={[
              product?.img1
                ? `${baseUrl}/imgs/products/${product?.img1}`
                : '/images/no-image.webp',
              product?.img2
                ? `${baseUrl}/imgs/products/${product?.img2}`
                : '/images/no-image.webp',
              product?.img3
                ? `${baseUrl}/imgs/products/${product?.img3}`
                : '/images/no-image.webp',
              product?.img4
                ? `${baseUrl}/imgs/products/${product?.img4}`
                : '/images/no-image.webp',
              product?.img5
                ? `${baseUrl}/imgs/products/${product?.img5}`
                : '/images/no-image.webp',
            ]}
          />
        </div>
        <div className="mt-2.5 md:mt-0 md:w-1/2 md:pl-8">
          <h3 className="text-2xl font-semibold">{product?.name}</h3>
          <p className="mt-4 text-gray-700">Mã sản phẩm: {product?.id}</p>
          <p className="mt-4 text-gray-700">
            Thương hiệu: {product?.brand_name}
          </p>
          <p className="mt-4 text-gray-700">
            Danh mục: {product?.category_name}
          </p>
          <div className="mt-6">
            <span className="text-2xl font-medium text-red-500">
              {formatPrice(
                product?.price ? product.price * currentQuantity : 0,
              )}
            </span>
          </div>
          <div className="mt-6">
            <QuantityEdit onChange={handleQuantityChange} />
          </div>
          <div className="flex flex-col md:flex-row mt-8 gap-4">
            <Button
              onClick={handleBuyNow}
              className="flex text-sm items-center justify-center font-bold w-full bg-red-500 border rounded-lg hover:bg-red-600"
            >
              <HandCoins color={'white'} size={16} className="flex md:mr-2" />
              <p className="hidden md:flex text-white">Đặt hàng ngay</p>
            </Button>

            <Button
              onClick={handleAddToCart}
              className="flex text-sm items-center justify-center font-bold w-full bg-gray-100 border rounded-lg hover:bg-gray-300"
            >
              <ShoppingCart color={'red'} size={16} className="flex md:mr-2" />
              <p className="hidden md:flex text-black">Thêm vào giỏ</p>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Mô tả sản phẩm:</h3>
        <p className="mt-4 text-gray-700">{product?.detail}</p>
      </div>

      <div>
        <ProductCategory
          categoryName={'Sản phẩm liên quan'}
          products={
            product?.similar_products?.map((product) => {
              return {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.img1,
              };
            }) || []
          }
        />
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
