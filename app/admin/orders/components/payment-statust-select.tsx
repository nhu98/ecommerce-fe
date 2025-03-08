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

interface PaymentStatusSelectProps<T extends FieldValues> {
  onChange: (value: { id: string; name: string }) => void;
  register?: UseFormRegister<T>;
  name?: keyof T;
  disabled?: boolean;
  defaultValue?: string;
}

const PaymentStatusSelect = <T extends FieldValues>({
  onChange,
  register,
  name,
  disabled,
  defaultValue,
}: PaymentStatusSelectProps<T>) => {
  const statusData = [
    { id: '0', name: 'Chưa thanh toán' },
    {
      id: '1',
      name: 'Đã thanh toán',
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
        <SelectValue placeholder="Chọn trạng thái thanh toán" />
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

export default PaymentStatusSelect;
