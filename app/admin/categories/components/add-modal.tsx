'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddCategoryFormData,
  addCategorySchema,
} from '@/schemaValidation/auth.schema';
import { Button } from '@/components/ui/button';

interface AddModalProps {
  childrenTrigger?: React.ReactNode;
  title?: string;
  description?: string;
  isLoading?: boolean;
  onSubmit: (data: AddCategoryFormData) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddModal = ({
  childrenTrigger,
  title,
  description,
  onSubmit,
  isLoading,
  open,
  setOpen,
}: AddModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{childrenTrigger}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <div className="w-full flex flex-row gap-4 mb-1">
            <Input
              disabled={isLoading}
              id="name"
              placeholder="Nhập tên danh mục"
              {...register('name')}
            />

            <Button
              type="submit"
              className={`bg-green-500 hover:bg-green-600 text-white ${isLoading && 'cursor-not-allowed opacity-50'}`}
              disabled={isLoading}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {isLoading ? 'Đang thêm...' : 'Thêm'}
            </Button>
          </div>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
