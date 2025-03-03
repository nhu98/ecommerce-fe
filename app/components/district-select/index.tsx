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

interface District {
  id: string;
  name: string;
  provinceId: string;
  type: number;
  typeText: string;
}

interface DistrictSelectProps {
  onChange: (value: { id: string; name: string }) => void;
  register: UseFormRegister<any>;
  name: string;
  cityId: string;
  disabled?: boolean;
  defaultValue?: string;
}

const DistrictSelect = ({
  onChange,
  register,
  name,
  cityId,
  disabled,
  defaultValue,
}: DistrictSelectProps) => {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(
          `https://open.oapi.vn/location/districts/${cityId}?page=0&size=100`,
        );
        if (!response.ok) {
          toast({
            title: 'Error',
            description: `Error fetching districts ${response.status}`,
            variant: 'destructive',
            duration: 3000,
          });
        }
        const data = await response.json();
        setDistricts(data.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: `Error fetching districts ${error}`,
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    if (cityId) fetchDistricts();
  }, [cityId]);

  const handleDistrictChange = (districtId: string) => {
    const selectedDistrict = districts.find(
      (district) => district.id === districtId,
    );
    if (selectedDistrict) {
      onChange({ id: selectedDistrict.id, name: selectedDistrict.name });
    }
  };

  return (
    <Select disabled={disabled} onValueChange={handleDistrictChange}>
      <SelectTrigger className="" {...register(name)}>
        <SelectValue placeholder={defaultValue || 'Chọn Quận / Huyện'} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {districts?.map((district) => (
          <SelectItem
            className="cursor-pointer hover:bg-gray-100"
            key={district.id}
            value={district.id}
          >
            {district.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DistrictSelect;
