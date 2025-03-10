'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface District {
  id: string;
  name: string;
  provinceId: string;
  type: number;
  typeText: string;
}

interface DistrictSelectProps<T extends FieldValues> {
  onChange: (value: { id: string; name: string }) => void;
  register: UseFormRegister<T>;
  name: keyof T;
  cityId: string;
  disabled?: boolean;
  defaultValue?: string;
}

const DistrictSelect = <T extends FieldValues>({
  onChange,
  register,
  name,
  cityId,
  disabled,
  defaultValue,
}: DistrictSelectProps<T>) => {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(
          `https://open.oapi.vn/location/districts/${cityId}?page=0&size=100`,
        );
        if (!response.ok) {
          toast({
            title: 'Lỗi',
            description: `Lỗi lấy dữ liệu ${response.status}`,
            variant: 'destructive',
            duration: 3000,
          });
        }
        const data = await response.json();
        const districts: District[] = data.data;

        setDistricts(districts);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: `Lỗi lấy dữ liệu ${error}`,
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    if (cityId) fetchDistricts();
  }, [cityId]);

  const handleDistrictChange = (districtName: string) => {
    const selectedDistrict = districts.find(
      (district) => district.name === districtName,
    );
    if (selectedDistrict) {
      onChange({ id: selectedDistrict.id, name: selectedDistrict.name });
    }
  };

  return (
    <Select
      defaultValue={defaultValue || ''}
      disabled={disabled}
      onValueChange={handleDistrictChange}
    >
      <SelectTrigger className="" {...register(name as Path<T>)}>
        <SelectValue placeholder={'Chọn Quận / Huyện'} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {districts?.map((district) => (
          <SelectItem
            className="cursor-pointer hover:bg-gray-100"
            key={district.id}
            value={district.name}
          >
            {district.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DistrictSelect;
