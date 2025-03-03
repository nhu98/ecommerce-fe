import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  SignUpFormData,
  SignUpRes,
  signUpSchema,
} from '@/schemaValidation/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import CitySelect from '@/app/components/city-select';
import DistrictSelect from '@/app/components/district-select';
import WardSelect from '@/app/components/ward-select';
import { toast } from '@/components/ui/use-toast';
import { post } from '@/lib/http-client';
import { decodeToken } from '@/lib/utils';
import { getUerInfo, sendTokenToNextServer } from '@/lib/auth-services';
import { Eye, EyeOff } from 'lucide-react';

interface SignInCardProps {
  onClose: () => void;
}

const SignUpCard = ({ onClose }: SignInCardProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await post<SignUpRes>('/users/create?role_id=3', data);

      if (result?.token) {
        localStorage.setItem('sessionToken', result.token);

        await sendTokenToNextServer(result.token);

        const decoded = decodeToken(result.token);

        if (!decoded?.phone) {
          toast({
            title: 'Error',
            description: 'Không có thông tin người dùng!',
            variant: 'destructive',
            duration: 3000,
          });

          return;
        }

        await getUerInfo(decoded.phone);

        toast({
          title: 'Success',
          description: 'Đăng ký thành công!',
          variant: 'success',
          duration: 3000,
        });
        router.push('/');
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.error('Error during signUp:', error);
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
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              disabled={loading}
              id="phoneNumber"
              type="tel"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
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
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              disabled={loading}
              id="fullName"
              type="text"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={loading}
              id="email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="city">Thành phố / Tỉnh</Label>
            <CitySelect
              onChange={(value) => {
                setValue('city', value.name);
                setSelectedCity(value.id);
              }}
              register={register}
              name="city"
              disabled={loading}
            />
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="district">Quận / Huyện</Label>
            <DistrictSelect
              onChange={(value) => {
                setValue('district', value.name);
                setSelectedDistrict(value.id);
              }}
              register={register}
              name="district"
              cityId={selectedCity}
              disabled={loading}
            />
            {errors.district && (
              <p className="text-red-500">{errors.district.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="ward">Phường / Xã</Label>
            <WardSelect
              onChange={(value) => {
                setValue('ward', value);
              }}
              register={register}
              name="ward"
              districtId={selectedDistrict}
              disabled={loading}
            />
            {errors.ward && (
              <p className="text-red-500">{errors.ward.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="street">Số nhà / Đường</Label>
            <Input disabled={loading} id="street" {...register('street')} />
            {errors.street && (
              <p className="text-red-500">{errors.street.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white"
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
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUpCard;
