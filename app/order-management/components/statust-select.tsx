'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface StatusSelectProps<T extends FieldValues> {
  onChange: (value: { id: string; name: string }) => void;
  register?: UseFormRegister<T>;
  name?: keyof T;
  disabled?: boolean;
  defaultValue?: string;
}

const StatusSelect = <T extends FieldValues>({
  onChange,
  register,
  name,
  disabled,
  defaultValue,
}: StatusSelectProps<T>) => {
  const statusData = [
    { id: 'waiting', name: 'Đang chờ' },
    {
      id: 'processing',
      name: 'Đang xử lý',
    },
    { id: 'delivering', name: 'Đang giao' },
    { id: 'delivered', name: 'Đã giao' },
    {
      id: 'canceled',
      name: 'Đã huỷ',
    },
  ];

  const handleBrandChange = (statusChange: string) => {
    const selectedBrand = statusData.find(
      (status) => status.id === statusChange,
    );
    if (selectedBrand) {
      onChange(selectedBrand);
    }
  };

  return (
    <Select
      defaultValue={defaultValue}
      disabled={disabled}
      onValueChange={handleBrandChange}
    >
      <SelectTrigger
        className=""
        {...(register ? register(name as Path<T>) : undefined)}
      >
        <SelectValue placeholder="Chọn trạng thái đơn hàng" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {statusData?.map((status) => (
          <SelectItem
            className="cursor-pointer hover:bg-gray-100"
            key={status.id}
            value={status.id}
          >
            {status.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
