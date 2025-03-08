'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Check, Filter } from 'lucide-react';
import Filters from '@/app/components/filters';
import { Description } from '@radix-ui/react-dialog';
import { FilterFormData } from '@/schemaValidation/auth.schema';

interface FiltersModelProps {
  onFilter?: (filter: FilterFormData) => void;
  defaultValues?: FilterFormData;
}

const FiltersModel = ({ onFilter, defaultValues }: FiltersModelProps) => {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(false);

  const handleFilter = (filter: FilterFormData) => {
    setOpen(false);
    if (onFilter) {
      const data = {
        ...filter,
        to: !!Number(filter.to) ? filter.to : '',
        from: !!Number(filter.from) ? filter.from : '',
      };
      onFilter(data);
    }
    if (
      !!Number(filter.to) ||
      !!Number(filter.from) ||
      !!filter.categoryId ||
      !!filter.brandId ||
      !!filter.sortBy
    ) {
      setActiveFilters(true);
    } else {
      setActiveFilters(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 cursor-pointer transition-all duration-500">
          <Filter size={18} />
          <Check
            size={18}
            className={activeFilters ? 'absolute top-0 right-0' : 'hidden'}
            color="green"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="flex justify-center sm:text-center">
          <DialogTitle className="">Chọn bộ lọc của bạn ở đây</DialogTitle>
          <Description></Description>
        </DialogHeader>
        <Filters onHandleFilter={handleFilter} defaultValues={defaultValues} />
      </DialogContent>
    </Dialog>
  );
};

export default FiltersModel;
