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

interface Ward {
  id: string;
  name: string;
  provinceId: string;
  type: number;
  typeText: string;
}

interface WardSelectProps<T extends FieldValues> {
  onChange: (value: { id: string; name: string }) => void;
  register: UseFormRegister<T>;
  name: keyof T;
  districtId: string;
  disabled?: boolean;
  defaultValue?: string;
}

const WardSelect = <T extends FieldValues>({
  onChange,
  register,
  name,
  districtId,
  disabled,
  defaultValue,
}: WardSelectProps<T>) => {
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await fetch(
          `https://open.oapi.vn/location/wards/${districtId}?page=0&size=100`,
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
        const wards: Ward[] = data.data;

        setWards(wards);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: `Lỗi lấy dữ liệu ${error}`,
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    if (districtId) {
      fetchWards();
    } else if (!districtId) {
      setWards([]);
    }
  }, [districtId]);

  const handleWardChange = (wardName: string) => {
    const selectedWard = wards.find((ward) => ward.name === wardName);

    if (selectedWard) {
      onChange({ id: selectedWard.id, name: selectedWard.name });
    }
  };

  return (
    <Select
      defaultValue={defaultValue || ''}
      disabled={disabled}
      onValueChange={handleWardChange}
    >
      <SelectTrigger className="" {...register(name as Path<T>)}>
        <SelectValue placeholder={'Chọn Phường / Xã'} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {wards?.map((ward) => (
          <SelectItem
            className="cursor-pointer hover:bg-gray-100"
            key={ward.id}
            value={ward.name}
          >
            {ward.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default WardSelect;
