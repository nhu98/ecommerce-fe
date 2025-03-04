'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import {
  CategoriesApiResponse,
  CategoryResponse,
} from '@/schemaValidation/auth.schema';
import { get } from '@/lib/http-client';
import { Button } from '@/components/ui/button';
import LoaderComponent from '@/app/components/loader';

interface CategorySelectProps<T extends FieldValues> {
  onChange: (value: { id: string; name: string }) => void;
  register: UseFormRegister<T>;
  name: keyof T;
  disabled?: boolean;
  defaultValue?: string;
}

const CategorySelect = <T extends FieldValues>({
  onChange,
  register,
  name,
  disabled,
  defaultValue,
}: CategorySelectProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(defaultValue);

  const [defaultValueLoaded, setDefaultValueLoaded] = useState(false); // Thêm state

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
          setCategories(result?.categories);
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

  useEffect(() => {
    if (defaultValue && !defaultValueLoaded && categories.length > 0) {
      checkDefaultValue();
    }
  }, [defaultValue, categories, currentPage, totalPages]);

  const handleCategoryChange = (CategoryId: string) => {
    setSelectedCategoryId(CategoryId);
    const selectedCategory = categories.find(
      (category) => category.id === CategoryId,
    );
    if (selectedCategory) {
      onChange({ id: selectedCategory.id, name: selectedCategory.name });
    }
  };

  const handleLoadMoreCategories = () => {
    if (currentPage >= totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  const checkDefaultValue = () => {
    if (categories.some((category) => category.id === defaultValue)) {
      setSelectedCategoryId(defaultValue);
      setDefaultValueLoaded(true); // Đánh dấu đã load defaultValue
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Load trang tiếp theo nếu defaultValue không có
    } else {
      setDefaultValueLoaded(true); // Đánh dấu đã kiểm tra hết các trang
    }
  };

  return (
    <Select
      disabled={disabled}
      onValueChange={handleCategoryChange}
      value={selectedCategoryId}
    >
      <SelectTrigger className="" {...register(name as Path<T>)}>
        <SelectValue placeholder="Chọn danh mục" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {categories?.map((category) => (
          <SelectItem
            className="cursor-pointer hover:bg-gray-100"
            key={category.id}
            value={category.id}
          >
            {category.name}
          </SelectItem>
        ))}

        {totalPages > 1 && (
          <Button
            onClick={handleLoadMoreCategories}
            className="w-full mt-2 hover:bg-gray-100"
          >
            Xem thêm
          </Button>
        )}
        {loading && <LoaderComponent />}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
