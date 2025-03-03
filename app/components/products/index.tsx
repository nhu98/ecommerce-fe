'use client';
import React, { useState } from 'react';
import ProductCard from '@/app/components/productCard';
import PaginationComponent from '@/app/components/pagination';

interface ProductCategoryProps {
  categoryName: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const Products: React.FC<ProductCategoryProps> = ({
  categoryName,
  products,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 1; // Số sản phẩm trên mỗi trang

  // Tính toán index của sản phẩm đầu tiên và cuối cùng trên trang hiện tại
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // Lọc sản phẩm cho trang hiện tại
  const currentProducts = products.slice(startIndex, endIndex);

  // Tính tổng số trang
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {currentProducts.map((product) => (
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

export default Products;
