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

interface City {
  id: string;
  name: string;
  type: number;
  typeText: string;
  slug: string;
}

interface CitySelectProps {
  onChange: (value: { id: string; name: string }) => void;
  register: UseFormRegister<unknown>;
  name: string;
  disabled?: boolean;
  defaultValue?: string;
}

const CitySelect = ({
  onChange,
  register,
  name,
  disabled,
  defaultValue,
}: CitySelectProps) => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          'https://open.oapi.vn/location/provinces?page=0&size=100',
        );
        if (!response.ok) {
          toast({
            title: 'Error',
            description: `Error fetching cities ${response.status}`,
            variant: 'destructive',
            duration: 3000,
          });
        }
        const data = await response.json();
        setCities(data.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: `Error fetching cities ${error}`,
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find((city) => city.id === cityId);
    if (selectedCity) {
      onChange({ id: selectedCity.id, name: selectedCity.name });
    }
  };

  return (
    <Select disabled={disabled} onValueChange={handleCityChange}>
      <SelectTrigger className="" {...register(name)}>
        <SelectValue placeholder={defaultValue || 'Chọn Thành phố / Tỉnh'} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {cities?.map((city) => (
          <SelectItem
            className="cursor-pointer hover:bg-gray-100"
            key={city.id}
            value={city.id}
          >
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CitySelect;
