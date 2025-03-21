'use client';
import { useEffect, useState } from 'react';
import { get } from '@/lib/http-client';
import {
  CategoriesApiResponse,
  CategoryResponse,
} from '@/schemaValidation/auth.schema';

export const useCategoryData = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<CategoriesApiResponse>('/category/get', {
          search: '',
          page: currentPage.toString(),
        });

        if (result?.categories.length === 0) {
          setCategories([]);
        } else if (result?.categories && result?.totalPages) {
          if (currentPage === 1) {
            setCategories(result?.categories);
          } else {
            setCategories((prevCategories) => [
              ...prevCategories,
              ...result.categories,
            ]);
          }
          setTotalPages(result?.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories().then();
  }, [currentPage]);

  const handleLoadMoreCategories = () => {
    if (currentPage >= totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  return {
    categories,
    currentPage,
    totalPages,
    loading,
    handleLoadMoreCategories,
  };
};
