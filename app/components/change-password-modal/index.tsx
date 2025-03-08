'use client';
import React, { useState } from 'react';
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
  ChangePasswordFormData,
  ChangePasswordResponse,
  changePasswordSchema,
} from '@/schemaValidation/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { put } from '@/lib/http-client';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isCustomer?: boolean;
  childrenTrigger?: React.ReactNode;
  phoneNumber: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ChangePasswordModal = ({
  isCustomer,
  phoneNumber,
  childrenTrigger,
  open,
  setOpen,
}: ChangePasswordModalProps) => {
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = isCustomer
        ? `/users/update?phone=${phoneNumber}`
        : `/users/updateAdmin?phone=${phoneNumber}`;

      const result = await put<ChangePasswordResponse>(url, {
        old_password: data.old_password,
        password: data.password,
      });

      if (result?.result.phone) {
        setOpen(false);
        toast({
          title: 'Thành công!',
          description: 'Cập nhật mật admin khẩu thành công!',
          variant: 'success',
          duration: 3000,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error('Error during change password:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOldPassword = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowOldPassword((prev) => !prev);
  };

  const togglePassword = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{childrenTrigger}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>Thay đổi mật khẩu</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="status">{'Mật khẩu hiện tại'}</Label>
              <div className="relative">
                <Input
                  disabled={loading}
                  id="old_password"
                  placeholder="Nhập mật khẩu hiện tại"
                  type={showOldPassword ? 'text' : 'password'}
                  {...register('old_password')}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={toggleOldPassword}
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {errors.old_password && (
                <p className="text-red-500">{errors.old_password.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="payment_status">{'Mật khẩu mới'}</Label>
              <div className="relative">
                <Input
                  disabled={loading}
                  id="password"
                  placeholder="Nhập mật khẩu mới"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
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

export default ChangePasswordModal;
