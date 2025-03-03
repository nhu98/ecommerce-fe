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
import { UseFormRegister } from 'react-hook-form';

interface Ward {
  id: string;
  name: string;
  provinceId: string;
  type: number;
  typeText: string;
}

interface WardSelectProps {
  onChange: (value: string) => void;
  register: UseFormRegister<unknown>;
  name: string;
  districtId: string;
  disabled?: boolean;
  defaultValue?: string;
}

const WardSelect = ({
  onChange,
  register,
  name,
  districtId,
  disabled,
  defaultValue,
}: WardSelectProps) => {
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await fetch(
          `https://open.oapi.vn/location/wards/${districtId}?page=0&size=100`,
        );
        if (!response.ok) {
          toast({
            title: 'Error',
            description: `Error fetching wards ${response.status}`,
            variant: 'destructive',
            duration: 3000,
          });
        }
        const data = await response.json();
        setWards(data.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: `Error fetching wards ${error}`,
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    if (districtId) fetchWards();
  }, [districtId]);

  return (
    <Select disabled={disabled} onValueChange={onChange}>
      <SelectTrigger className="" {...register(name)}>
        <SelectValue placeholder={defaultValue || 'Chọn Phường / Xã'} />
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
