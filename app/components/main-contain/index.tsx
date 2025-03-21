'use client';
import React, { useEffect, useRef, useState } from 'react';
import ProductCategory from '@/app/components/productCategory';
import { get } from '@/lib/http-client';
import {
  CategoriesApiResponse,
  CategoryResponse,
  ProductsApiResponse,
} from '@/schemaValidation/auth.schema';
import { Button } from '@/components/ui/button';
import LoaderComponent from '@/app/components/loader';

interface GroupedProduct {
  id: string;
  name: string;
  products: {
    id: string;
    name: string;
    price: number;
    image: string;
  }[];
}

const MainContent = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [categoriesTotalPages, setCategoriesTotalPages] = useState<number>(0);
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);

  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [uniqueGroupedProducts, setUniqueGroupedProducts] = useState<
    GroupedProduct[]
  >([]);
  const loadedCategories = useRef<string[]>([]); // Sử dụng useRef

  useEffect(() => {
    const fetchCategories = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<CategoriesApiResponse>('/category/get', {
          search: '',
          page: categoriesCurrentPage.toString(),
        });

        if (result?.categories.length === 0) {
          setCategories([]);
        } else if (result?.categories && result?.totalPages) {
          if (categoriesCurrentPage === 1) {
            setCategories(result?.categories);
          } else {
            setCategories((prevCategories) => [
              ...prevCategories,
              ...result.categories,
            ]);
          }
          setCategoriesTotalPages(result?.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories().then();
  }, [categoriesCurrentPage]);

  useEffect(() => {
    const fetchProductsByCategory = async (
      categoryId: string,
      categoryName: string,
    ) => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<ProductsApiResponse>('/product/get', {
          search: '',
          category: categoryId,
          brand: '',
          minPrice: '',
          maxPrice: '',
          sortBy: '',
          page: '1',
        });

        if (result?.products.length === 0) {
          return;
        } else if (result?.products && result?.totalPages) {
          setGroupedProducts((prev) => [
            ...prev,
            {
              id: categoryId,
              name: categoryName,
              products: result?.products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.img1,
              })),
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllCategories = async () => {
      if (!categories.length) return;

      for (const category of categories) {
        if (!loadedCategories.current.includes(category.id)) {
          await fetchProductsByCategory(category.id, category.name);
          loadedCategories.current.push(category.id);
        }
      }
    };

    fetchAllCategories();
  }, [categories]);

  useEffect(() => {
    if (groupedProducts.length > 0) {
      const uniqueGroupedProducts = Array.from(
        new Set(groupedProducts.map((obj) => JSON.stringify(obj))),
      ).map((str) => JSON.parse(str));

      setUniqueGroupedProducts(uniqueGroupedProducts);
    }
  }, [groupedProducts]);

  const handleLoadMoreCategories = () => {
    if (categoriesCurrentPage >= categoriesTotalPages) return;
    setCategoriesCurrentPage(categoriesCurrentPage + 1);
  };

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (groupedProducts.length === 0) {
      return <p>Danh sách sản phẩm rỗng.</p>;
    }

    return (
      <>
        {uniqueGroupedProducts.map((groupedProduct) => (
          <ProductCategory
            key={`category-${groupedProduct.id}`}
            categoryName={groupedProduct.name}
            products={groupedProduct.products}
            loadMoreId={groupedProduct.id}
          />
        ))}
        {categoriesTotalPages > 1 &&
          categoriesCurrentPage < categoriesTotalPages && (
            <Button
              onClick={handleLoadMoreCategories}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-100"
            >
              Xem thêm
            </Button>
          )}
      </>
    );
  };

  return (
    <div>
      {renderContent()}
      {loading && <LoaderComponent />}
    </div>
  );
};

export default MainContent;
