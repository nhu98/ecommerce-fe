'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormRegister } from 'react-hook-form';
import {
  BrandResponse,
  BrandsApiResponse,
} from '@/schemaValidation/auth.schema';
import { get } from '@/lib/http-client';
import { Button } from '@/components/ui/button';
import LoaderComponent from '@/app/components/loader';

interface BrandSelectProps {
  onChange: (value: { id: string; name: string }) => void;
  register: UseFormRegister<any>;
  name:
    | 'name'
    | 'brand_id'
    | 'category_id'
    | 'price'
    | 'detail'
    | 'img1'
    | 'img2'
    | 'img3'
    | 'img4'
    | 'img5'
    | 'brandId';
  disabled?: boolean;
  defaultValue?: string;
}

const BrandSelect = ({
  onChange,
  register,
  name,
  disabled,
  defaultValue,
}: BrandSelectProps) => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(
    defaultValue,
  );
  const [defaultValueLoaded, setDefaultValueLoaded] = useState(false); // Thêm state

  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  useEffect(() => {
    if (defaultValue && !defaultValueLoaded && brands.length > 0) {
      checkDefaultValue();
    }
  }, [defaultValue, brands, currentPage, totalPages]);

  const fetchBrands = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await get<BrandsApiResponse>('/brand/get', {
        search: '',
        page: currentPage.toString(),
      });

      if (result?.brands.length === 0) {
        setBrands([]);
      } else if (result?.brands && result?.totalPages) {
        setBrands(result?.brands);
        setTotalPages(result?.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkDefaultValue = () => {
    if (brands.some((brand) => brand.id === defaultValue)) {
      setSelectedBrandId(defaultValue);
      setDefaultValueLoaded(true); // Đánh dấu đã load defaultValue
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Load trang tiếp theo nếu defaultValue không có
    } else {
      setDefaultValueLoaded(true); // Đánh dấu đã kiểm tra hết các trang
    }
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    const selectedBrand = brands.find((brand) => brand.id === brandId);
    if (selectedBrand) {
      onChange({ id: selectedBrand.id, name: selectedBrand.name });
    }
  };

  const handleLoadMoreBrands = () => {
    if (currentPage >= totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  return (
    <Select
      disabled={disabled}
      onValueChange={handleBrandChange}
      value={selectedBrandId}
    >
      <SelectTrigger className="" {...register(name)}>
        <SelectValue placeholder="Chọn thương hiệu" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {brands?.map((brand) => (
          <SelectItem
            className="cursor-pointer hover:bg-gray-100"
            key={brand.id}
            value={brand.id}
          >
            {brand.name}
          </SelectItem>
        ))}

        {totalPages > 1 && (
          <Button
            onClick={handleLoadMoreBrands}
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

export default BrandSelect;
