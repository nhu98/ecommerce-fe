'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  UpdateOrderResponse,
  UpdateOrderStatusFormData,
  updateOrderStatusSchema,
} from '@/schemaValidation/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import StatusSelect from '@/app/admin/orders/components/statust-select';
import PaymentStatusSelect from '@/app/admin/orders/components/payment-statust-select';
import { toast } from '@/components/ui/use-toast';
import { put } from '@/lib/http-client';

interface UpdateStatusModalProps {
  orderId: string;
  childrenTrigger?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultStatus?: string;
  defaultPaymentStatus?: string;
}

const UpdateStatusModal = ({
  orderId,
  childrenTrigger,
  open,
  setOpen,
  defaultStatus,
  defaultPaymentStatus,
}: UpdateStatusModalProps) => {
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateOrderStatusFormData>({
    resolver: zodResolver(updateOrderStatusSchema),
  });

  useEffect(() => {
    if (defaultStatus) {
      setValue('status', defaultStatus);
    }
    if (defaultPaymentStatus) {
      setValue('payment_status', defaultPaymentStatus);
    }
  }, [defaultStatus, defaultPaymentStatus, setValue]);

  const onSubmit = async (data: UpdateOrderStatusFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await put<UpdateOrderResponse>(
        `/order/update?id=${orderId}`,
        {
          status: data.status,
          payment_status: data.payment_status,
        },
      );

      if (result?.result?.id) {
        setOpen(false);
        toast({
          title: 'Thành công!',
          description: 'Cập nhật trạng thái đơn hàng thành công!',
          variant: 'success',
          duration: 3000,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error('Error during update order status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{childrenTrigger}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>Mã đơn hàng: {orderId}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="status">{'Trạng thái đơn hàng'}</Label>
              <StatusSelect
                onChange={(value) => {
                  setValue('status', value.id);
                }}
                register={register}
                name="status"
                disabled={loading}
                defaultValue={defaultStatus}
              />
              {errors.status && (
                <p className="text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="payment_status">{'Trạng thái thanh toán'}</Label>
              <PaymentStatusSelect
                onChange={(value) => {
                  setValue('payment_status', value.id);
                }}
                register={register}
                name="payment_status"
                disabled={loading}
                defaultValue={defaultPaymentStatus}
              />
              {errors.payment_status && (
                <p className="text-red-500">{errors.payment_status.message}</p>
              )}
            </div>

            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className={`bg-red-500 hover:bg-red-600 text-white ${loading && 'cursor-not-allowed opacity-50'}`}
                disabled={loading}
              >
                {loading && (
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
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
