'use client';
import React, { useEffect } from 'react';
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
  AddBrandFormData,
  addBrandSchema,
} from '@/schemaValidation/auth.schema';
import { Button } from '@/components/ui/button';

interface UpdateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: AddBrandFormData) => void;
  isLoading?: boolean;
  childrenTrigger?: React.ReactNode;
  title?: string;
  description?: string;
  value: string;
}

const UpdateModal = ({
  childrenTrigger,
  title,
  description,
  onSubmit,
  isLoading,
  open,
  setOpen,
  value,
}: UpdateModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: formReset,
    setValue,
  } = useForm<AddBrandFormData>({
    resolver: zodResolver(addBrandSchema),
    defaultValues: {
      name: value,
    },
  });

  useEffect(() => {
    setValue('name', value);
  }, [value, setValue]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      formReset(); // Reset form khi đóng dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              placeholder="Nhập tên thương hiệu"
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
              {isLoading ? 'Đang Cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateModal;
