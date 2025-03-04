'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { FilterFormData, filterSchema } from '@/schemaValidation/auth.schema';
import BrandSelect from '@/app/admin/components/brand-select';
import CategorySelect from '@/app/admin/components/category-select';

interface FilterProps {
  onHandleFilter: (filters: FilterFormData) => void;
  defaultValues?: FilterFormData;
}

const Filters = ({ onHandleFilter, defaultValues }: FilterProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      from: '0',
      to: '0',
    },
  });

  const [selectedSort, setSelectedSort] = useState<string>(
    defaultValues?.sortBy || '',
  );

  useEffect(() => {
    if (defaultValues) {
      setValue(
        'from',
        defaultValues?.from !== ''
          ? Number(defaultValues?.from).toLocaleString('vi-VN')
          : '0',
      );
      setValue(
        'to',
        defaultValues?.to !== ''
          ? Number(defaultValues?.to).toLocaleString('vi-VN')
          : '0',
      );
      setValue('sortBy', defaultValues.sortBy);
      setValue('brandId', defaultValues.brandId);
      setValue('categoryId', defaultValues.categoryId);
    }
  }, [defaultValues, setValue]);

  const onSubmitPrice = (data: FilterFormData) => {
    onHandleFilter(data);
  };

  const handleNumberInput = (field: 'from' | 'to', value: string) => {
    const sanitizedValue = value.replace(/\D/g, '');
    const formattedValue = Number(sanitizedValue).toLocaleString('vi-VN'); // Thêm dấu chấm
    setValue(field, formattedValue, { shouldValidate: true });
  };

  const handleSortByChange = (value: string) => {
    setSelectedSort(value);
    setValue('sortBy', value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitPrice)}
      className="flex flex-col items-center"
    >
      <div className="">
        <div className="mb-4">
          <Label>Giá</Label>

          <div className="w-full flex flex-col gap-8 md:flex-row">
            <div className="flex gap-1">
              <Input
                type="text"
                placeholder="Từ"
                {...register('from')}
                value={watch('from')}
                onChange={(e) => handleNumberInput('from', e.target.value)}
                className="md:w-40"
              />
              <span className="flex items-center text-gray-500">₫</span>
            </div>
            <div className="flex gap-1">
              <Input
                type="text"
                placeholder="Đến"
                {...register('to')}
                value={watch('to')}
                onChange={(e) => handleNumberInput('to', e.target.value)}
                className="md:w-40"
              />
              <span className="flex items-center text-gray-500">₫</span>
            </div>
          </div>
          {errors.from && <p className="text-red-500">{errors.from.message}</p>}
          {errors.to && <p className="text-red-500">{errors.to.message}</p>}
        </div>

        <div className="w-full flex flex-col gap-4 mb-4">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="brand_id">{'Thương hiệu sản phẩm'}</Label>
            <BrandSelect
              onChange={(value) => {
                setValue('brandId', value.id);
              }}
              register={register}
              defaultValue={defaultValues?.brandId}
              name="brandId"
            />
            {errors.brandId && (
              <p className="text-red-500">{errors.brandId.message}</p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="category_id">{'Danh mục sản phẩm'}</Label>
            <CategorySelect
              onChange={(value) => {
                setValue('categoryId', value.id);
              }}
              register={register}
              defaultValue={defaultValues?.categoryId}
              name="categoryId"
            />
            {errors.categoryId && (
              <p className="text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label>Sắp xếp</Label>
          <Select value={selectedSort} onValueChange={handleSortByChange}>
            <SelectTrigger
              className="border border-gray-300 rounded px-4 py-2"
              {...register('sortBy')}
            >
              <SelectValue placeholder="Chọn cách sắp xếp" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem
                className="cursor-pointer hover:bg-gray-100"
                key={'asc'}
                value={'asc'}
              >
                Giá tăng dần
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-gray-100"
                key={'desc'}
                value={'desc'}
              >
                Giá giảm dần
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-2 mt-4">
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Lọc
          </Button>

          <Button
            onClick={() =>
              onHandleFilter({
                from: '',
                to: '',
                categoryId: '',
                brandId: '',
                sortBy: '',
              })
            }
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Bỏ Lọc
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Filters;
