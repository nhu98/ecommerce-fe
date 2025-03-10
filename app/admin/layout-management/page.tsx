'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ShopDataApiResponse,
  UpdateShopFormData,
  UpdateShopResponse,
  updateShopSchema,
} from '@/schemaValidation/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { get, putWithFormData } from '@/lib/http-client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LoaderComponent from '@/app/components/loader';
import Image from 'next/image';
import envConfig from '@/config';

const baseUrl = envConfig.NEXT_PUBLIC_URL;

export default function LayoutManagement() {
  const [loading, setLoading] = useState(false);

  const [logo, setLogo] = useState<string | null>();
  const [banner, setBanner] = useState<string | null>();

  const logoInputRefs = useRef<HTMLInputElement | null>(null);
  const bannerInputRefs = useRef<HTMLInputElement | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateShopFormData>({
    resolver: zodResolver(updateShopSchema),
  });

  useEffect(() => {
    logoInputRefs.current = React.createRef<HTMLInputElement>().current;
    bannerInputRefs.current = React.createRef<HTMLInputElement>().current;
  }, []);

  useEffect(() => {
    const fetchShopData = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<ShopDataApiResponse>('/shop/get');

        if (result?.name) {
          setValue('name', result.name);
          setValue('sologan', result.sologan);

          if (result.logo) {
            setLogo(`${baseUrl}/imgs/products/${result.logo}`);
          }
          if (result.banner) {
            setBanner(`${baseUrl}/imgs/products/${result.banner}`);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData().then();
  }, [setValue]);

  const onSubmitForm = async (data: UpdateShopFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sologan', data.sologan);

    if (logo) {
      formData.append('logo', logoInputRefs.current?.files?.[0] || '');
    }
    if (banner) {
      formData.append('banner', bannerInputRefs.current?.files?.[0] || '');
    }

    if (loading) return;
    setLoading(true);
    try {
      const result: UpdateShopResponse = await putWithFormData(
        '/shop/update',
        formData,
      );

      if (result?.result?.name) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin cửa hàng thành công!',
          variant: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin cửa hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (type === 'logo') {
          setLogo(imageUrl);
        } else if (type === 'banner') {
          setBanner(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (type: string) => {
    if (type === 'logo') {
      setLogo(null);

      if (logoInputRefs.current) {
        logoInputRefs.current.value = '';
      }
    } else if (type === 'banner') {
      setBanner(null);

      if (bannerInputRefs.current) {
        bannerInputRefs.current.value = '';
      }
    }
  };

  return (
    <div className="w-full min-h-[100vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý giao diện</h2>

        <div>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="name">{'Tên cửa hàng'}</Label>
              <Input
                id="name"
                disabled={loading}
                placeholder="Nhập tên cửa hàng"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="name">{'Khẩu hiệu'}</Label>
              <Input
                id="sologan"
                disabled={loading}
                placeholder="Nhập khẩu hiệu"
                {...register('sologan')}
              />
              {errors.sologan && (
                <p className="text-red-500">{errors.sologan.message}</p>
              )}
            </div>

            <div className="w-full flex flex-row justify-between gap-8">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="img">Logo</Label>
                <div className="grid grid-cols-1">
                  <Image
                    src={logo || '/images/no-image.webp'}
                    alt={'img-logo'}
                    width={160}
                    height={160}
                    onClick={() => {}}
                    className={`w-full rounded-lg object-cover cursor-pointer${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Input
                    ref={(el) => {
                      if (el) {
                        logoInputRefs.current = el;
                      }
                    }}
                    id="logo"
                    type="file"
                    accept="image/*"
                    disabled={loading}
                    onChange={(event) => handleFileChange(event, 'logo')}
                    className="hidden"
                  />

                  {logo && (
                    <span className="text-sm text-gray-600 truncate">
                      {logoInputRefs.current?.files?.[0]?.name || ''}
                    </span>
                  )}

                  <div className="flex flex-row gap-2">
                    <label
                      htmlFor={'logo'}
                      className={`w-full bg-blue-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''} `}
                    >
                      Chọn Logo
                    </label>

                    {logo && (
                      <label
                        onClick={() => handleClearImage('logo')}
                        className={`w-full bg-red-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Bỏ chọn
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="img">banner</Label>
                <div className="grid grid-cols-1">
                  <Image
                    src={banner || '/images/no-image.webp'}
                    alt={'img-banner'}
                    width={160}
                    height={160}
                    onClick={() => {}}
                    className={`w-full rounded-lg object-cover cursor-pointer${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Input
                    ref={(el) => {
                      if (el) {
                        bannerInputRefs.current = el;
                      }
                    }}
                    id="banner"
                    type="file"
                    accept="image/*"
                    disabled={loading}
                    onChange={(event) => handleFileChange(event, 'banner')}
                    className="hidden"
                  />

                  {logo && (
                    <span className="text-sm text-gray-600 truncate">
                      {bannerInputRefs.current?.files?.[0]?.name || ''}
                    </span>
                  )}

                  <div className="flex flex-row gap-2">
                    <label
                      htmlFor={'banner'}
                      className={`w-full bg-blue-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''} `}
                    >
                      Chọn Banner
                    </label>

                    {banner && (
                      <label
                        onClick={() => handleClearImage('banner')}
                        className={`w-full bg-red-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Bỏ chọn
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
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
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
