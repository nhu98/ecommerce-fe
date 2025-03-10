'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginRes,
  SignInFormData,
  signInSchema,
} from '@/schemaValidation/auth.schema';
import { toast } from '@/components/ui/use-toast';
import { post } from '@/lib/http-client';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/lib/utils';
import { getUerInfo, sendTokenToNextServer } from '@/lib/auth-services';
import { Eye, EyeOff } from 'lucide-react';

interface SignInCardProps {
  onClose: () => void;
}

const SignInCard = ({ onClose }: SignInCardProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await post<LoginRes>('/login', {
        phone: data.username,
        password: data.password,
      });

      if (result?.token) {
        localStorage.setItem('sessionToken', result.token);

        await sendTokenToNextServer(result.token);

        const decoded = decodeToken(result.token);

        if (!decoded?.phone) {
          toast({
            title: 'Lỗi',
            description: 'Không có thông tin người dùng!',
            variant: 'destructive',
            duration: 3000,
          });

          return;
        }

        await getUerInfo(decoded.phone);

        toast({
          title: 'Thành công',
          description: 'Đăng nhập thành công!',
          variant: 'success',
          duration: 3000,
        });

        if (decoded?.role_id === 1) {
          router.push('/admin');
        } else if (decoded?.role_id === 3) {
          router.push('/');
        }

        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    } catch (error) {
      console.error('Error during signIn:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">{'Số điện thoại'}</Label>
            <Input
              disabled={loading}
              id="username"
              placeholder="Nhập số điện thoại"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                disabled={loading}
                id="password"
                placeholder="Nhập mật khẩu"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="pr-5"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {errors?.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
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
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignInCard;
