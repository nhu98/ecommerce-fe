import React from 'react';
import ProductCard from '@/app/components/productCard';
import Link from 'next/link';

interface ProductCategoryProps {
  categoryName: string;
  products: Product[];
  loadMoreId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({
  categoryName,
  products,
  loadMoreId,
}) => {
  return (
    <div className="mt-8">
      <div className="flex w-full bg-gray-100 py-1 px-2 justify-between mb-4">
        <h2 className="text-xl font-semibold">{categoryName}</h2>
        {loadMoreId && (
          <div className=" hover:underline hover:text-red-500">
            <Link href={`/products?categoryId=${loadMoreId}`}>Load more</Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
