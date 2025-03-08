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

export default function Product() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const [categoryName, setCategoryName] = useState('');

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<ProductsApiResponse>('/product/get', {
          search: '',
          category: categoryId || '',
          brand: '',
          minPrice: '',
          maxPrice: '',
          sortBy: '',
          page: currentPage.toString(),
        });

        if (result?.products.length === 0) {
          setProducts([]);
        } else if (result?.products && result?.totalPages) {
          setCategoryName(result?.products[0]?.category_name);

          const products: Product[] = result?.products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.img1,
          }));
          setProducts(products);
          setTotalPages(result?.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().then();
  }, [categoryId, currentPage]);

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (products.length === 0) {
      return <p>Danh sách sản phẩm rỗng.</p>;
    }

    return (
      <div className="w-full min-h-[50vh]">
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
    <div>
      <div className="wrapper overflow-x-hidden mx-4">
        <div className="flex flex-col">
          <div className="bg-gray-100 py-1 px-2 flex flex-col justify-center mb-4">
            <h2 className="text-xl font-semibold">{categoryName}</h2>
          </div>

          {renderContent()}
        </div>
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
