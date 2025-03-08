'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { get } from '@/lib/http-client';
import { ProductsApiResponse } from '@/schemaValidation/auth.schema';
import ProductCard from '@/app/components/productCard';
import PaginationComponent from '@/app/components/pagination';
import LoaderComponent from '@/app/components/loader';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get('search');
  const categoryId = searchParams.get('category');
  const brandId = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sortBy = searchParams.get('sortBy');

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<ProductsApiResponse>('/product/get', {
          search: searchValue?.trim() || '',
          category: categoryId || '',
          brand: brandId || '',
          minPrice: minPrice || '',
          maxPrice: maxPrice || '',
          sortBy: sortBy || '',
          page: currentPage.toString(),
        });

        if (result?.products.length === 0) {
          setProducts([]);
        } else if (result?.products && result?.totalPages) {
          const products: Product[] = result.products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.img1,
          }));
          setProducts(products);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().then();
  }, [
    searchValue,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    sortBy,
    currentPage,
  ]);

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (products.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center">
          <p>Danh sách sản phẩm rỗng.</p>
        </div>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-[50vh]">
      <div className="wrapper overflow-x-hidden m-8">
        <div className="flex flex-col mt-8 gap-4">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold">TÌM KIẾM SẢN PHẨM</h2>

            <p className="text-gray-500">
              Tìm thấy {products?.length || 0} sản phẩm phù hợp với từ khóa :{' '}
              {searchValue}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
