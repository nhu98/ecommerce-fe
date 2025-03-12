'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  UpdateUserFormData,
  UpdateUserResponse,
  updateUserSchema,
  UserDataType,
} from '@/schemaValidation/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CitySelect from '@/app/components/city-select';
import DistrictSelect from '@/app/components/district-select';
import WardSelect from '@/app/components/ward-select';
import { Button } from '@/components/ui/button';
import { put } from '@/lib/http-client';
import { toast } from '@/components/ui/use-toast';
import { getLocalUser } from '@/lib/utils';
import { useUser } from '@/lib/useUser';
import { useAddress } from '@/lib/useAddress';
import LoaderComponent from '@/app/components/loader';

export default function AccountManagement() {
  const [localUser, setLocalUser] = useState<UserDataType | undefined>(
    undefined,
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  const {
    selectedCity,
    setSelectedCity,
    selectedDistrict,
    setSelectedDistrict,
    cityDefault,
    setCityDefault,
    districtDefault,
    setDistrictDefault,
    wardDefault,
    setWardDefault,
  } = useAddress(localUser?.city, localUser?.district);

  const { user, loading, setLoading } = useUser(localUser?.phone);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalUser(getLocalUser());
      setCityDefault(getLocalUser()?.city || '');
      setDistrictDefault(getLocalUser()?.district || '');
      setWardDefault(getLocalUser()?.ward || '');
    }
  }, []);

  useEffect(() => {
    if (user?.phone) {
      setValue('name', user?.name || '');
      setValue('phone', user?.phone || '');
      setValue('email', user?.email || '');
      setValue('city', user?.city || '');
      setValue('district', user?.district || '');
      setValue('ward', user?.ward || '');
      setValue('street', user?.street || '');
    }
  }, [user]);

  const onSubmit = async (data: UpdateUserFormData) => {
    if (user?.phone) {
      if (loading) return;
      setLoading(true);
      try {
        const result = await put<UpdateUserResponse>(
          `/users/update?phone=${user?.phone}`,
          data,
        );

        if (result?.result.phone) {
          toast({
            title: 'Thành công',
            description: 'Cập nhật thông tin thành công!',
            variant: 'success',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error during update user info:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (!user?.phone) {
      return (
        <div className="flex flex-col items-center">
          <p className="text-lg">Không có thông tin tài khoản!</p>
        </div>
      );
    }

    return (
      <div className="w-1/2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label className="flex flex-row" htmlFor="phoneNumber">
                Số điện thoại<p className="text-red-500 ml-1">*</p>
              </Label>
              <Input
                disabled={true}
                id="phoneNumber"
                type="tel"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="flex flex-row" htmlFor="fullName">
                Tên<p className="text-red-500 ml-1">*</p>
              </Label>
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
              <Label className="flex flex-row" htmlFor="city">
                Thành phố / Tỉnh<p className="text-red-500 ml-1">*</p>
              </Label>
              <CitySelect
                onChange={(value) => {
                  setValue('city', value.name);
                  setValue('district', '');
                  setValue('ward', '');

                  setCityDefault('');
                  setDistrictDefault('');
                  setWardDefault('');

                  setSelectedDistrict('');
                  setSelectedCity(value.id);
                }}
                register={register}
                name="city"
                defaultValue={cityDefault}
              />
              {errors.city && (
                <p className="text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="flex flex-row" htmlFor="district">
                Quận / Huyện<p className="text-red-500 ml-1">*</p>
              </Label>
              <DistrictSelect
                onChange={(value) => {
                  setValue('district', value.name);
                  setSelectedDistrict(value.id);
                }}
                register={register}
                name="district"
                cityId={selectedCity}
                defaultValue={districtDefault}
              />
              {errors.district && (
                <p className="text-red-500">{errors.district.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="flex flex-row" htmlFor="ward">
                Phường / Xã<p className="text-red-500 ml-1">*</p>
              </Label>
              <WardSelect
                onChange={(value) => {
                  setValue('ward', value.name);
                }}
                register={register}
                name="ward"
                districtId={selectedDistrict}
                defaultValue={wardDefault}
              />
              {errors.ward && (
                <p className="text-red-500">{errors.ward.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="flex flex-row" htmlFor="street">
                Số nhà / Đường<p className="text-red-500 ml-1">*</p>
              </Label>
              <Input disabled={loading} id="street" {...register('street')} />
              {errors.street && (
                <p className="text-red-500">{errors.street.message}</p>
              )}
            </div>
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
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="w-full min-h-[80vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <div className="flex w-full flex-col justify-center items-center">
          <h1 className="text-2xl font-semibold mb-4">Thông tin tài khoản</h1>
          {renderContent()}
        </div>
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
