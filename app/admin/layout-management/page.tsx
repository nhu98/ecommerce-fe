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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Description } from '@radix-ui/react-dialog';

const baseUrl = 'https://be.sondiennuoc.vn';

export default function LayoutManagement() {
  const [loading, setLoading] = useState(false);

  const [logo, setLogo] = useState<string | null>();
  const [originalLogo, setOriginalLogo] = useState<string | null>(null);

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const logoInputRefs = useRef<HTMLInputElement | null>(null);
  const bannerInputRefs = useRef<HTMLInputElement | null>(null);

  const sliderInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [previewSliders, setPreviewSliders] = useState<(string | null)[]>(
    Array(5).fill(null),
  );
  const [originalSliders, setOriginalSliders] = useState<(string | null)[]>(
    Array(5).fill(null),
  ); // Store original slider names

  const [openImgDialog, setOpenImgDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    sliderInputRefs.current = Array(5)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>().current);
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
            setLogo(`${baseUrl}/imgs/shop/${result.logo}`);
            setOriginalLogo(result.logo);
          }

          const newPreviewSliders = Array(5).fill(null);
          const newOriginalSliders = Array(5).fill(null);
          for (let i = 1; i <= 5; i++) {
            const imgField = `banner${i}` as keyof ShopDataApiResponse;
            if (result[imgField]) {
              newPreviewSliders[i - 1] =
                `${baseUrl}/imgs/shop/${result[imgField]}`;
              newOriginalSliders[i - 1] = result[imgField]; // Store original slider names
            }
          }
          setPreviewSliders(newPreviewSliders);
          setOriginalSliders(newOriginalSliders);
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

    sliderInputRefs.current.forEach((ref, index) => {
      if (ref && ref.files && ref.files[0]) {
        formData.append(`banner${index + 1}`, ref.files[0]);
      }
    });

    // Add images to delete
    if (imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
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
      // Add to imagesToDelete if the cleared logo was a default one
      if (originalLogo) {
        setImagesToDelete((prev) => [...prev, 'logo']);
      }
    }
  };

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewSliders((prev) => {
          const newPreviewImages = [...prev];
          newPreviewImages[index] = imageUrl;
          return newPreviewImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSlider = (index: number) => {
    setPreviewSliders((prev) => {
      const newPreviewImages = [...prev];
      newPreviewImages[index] = null;
      return newPreviewImages;
    });
    if (sliderInputRefs.current[index]) {
      sliderInputRefs.current[index].value = '';
    }
    // Add to imagesToDelete if the cleared slider was a default one
    if (originalSliders[index]) {
      setImagesToDelete((prev) => [...prev, `banner${index + 1}`]);
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
              <div className="w-1/3 flex flex-col gap-2">
                <Label htmlFor="img">Logo</Label>
                <div className="grid grid-cols-1">
                  <Image
                    src={logo || '/images/no-image.webp'}
                    alt={'img-logo'}
                    width={160}
                    height={160}
                    onClick={() => {
                      setSelectedImage(logo || '/images/no-image.webp');
                      setOpenImgDialog(true);
                    }}
                    className={`rounded-lg object-cover cursor-pointer${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    unoptimized
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

                  {/*{logo && (*/}
                  {/*  <span className="text-sm text-gray-600 truncate">*/}
                  {/*    {logoInputRefs.current?.files?.[0]?.name || ''}*/}
                  {/*  </span>*/}
                  {/*)}*/}

                  <div className="flex flex-col md:flex-row gap-2">
                    <label
                      htmlFor={'logo'}
                      className={`bg-blue-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''} `}
                    >
                      Chọn Logo
                    </label>

                    <label
                      onClick={() => handleClearImage('logo')}
                      className={`bg-red-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Bỏ chọn
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label>{'Sliders'}</Label>

              <div className="grid grid-cols-2 gap-4">
                {previewSliders.map((image, index) => (
                  <div key={index} className={'w-full h-fit flex flex-col'}>
                    <Image
                      src={image || '/images/no-image.webp'}
                      alt={`img${index + 1}`}
                      width={160}
                      height={160}
                      onClick={() => {
                        setSelectedImage(image);
                        setOpenImgDialog(true);
                      }}
                      className={`w-full h-[200px] object-cover rounded-lg cursor-pointer${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      unoptimized
                    />

                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        ref={(el) => {
                          if (el) {
                            sliderInputRefs.current[index] = el;
                          }
                        }}
                        id={`img${index + 1}`}
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={(event) => handleSliderChange(event, index)}
                        className="hidden"
                      />

                      <div className={`flex flex-col md:flex-row gap-2`}>
                        <div className="flex flex-row items-center">
                          <label
                            htmlFor={`img${index + 1}`}
                            className={`bg-blue-500 text-white px-2 py-1 rounded cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''} `}
                          >
                            Chọn hình {index + 1}
                          </label>
                        </div>

                        <label
                          onClick={() => handleClearSlider(index)}
                          className={`bg-red-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Bỏ chọn
                        </label>
                        {/*<div className="flex flex-row items-center">*/}
                        {/*  {image && (*/}
                        {/*    <span className="text-sm text-gray-600 truncate max-w-[100px]">*/}
                        {/*      {sliderInputRefs.current[index]?.files?.[0]*/}
                        {/*        ?.name || ''}*/}
                        {/*      ád,al;msdl;ámldma;lsmd;ámd;má;ldmal;mdl;ámdl;mal;sdml;ámdl;*/}
                        {/*    </span>*/}
                        {/*  )}*/}
                        {/*</div>*/}
                      </div>
                    </div>
                  </div>
                ))}
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

      <Dialog open={openImgDialog} onOpenChange={setOpenImgDialog}>
        <DialogTrigger asChild></DialogTrigger>
        {/* Modal */}
        <DialogContent className="!max-w-3xl !justify-start flex flex-col items-center bg-transparent border-0 shadow-none p-0">
          <DialogTitle className="m-4 hidden"></DialogTitle>
          <Description className=" hidden"></Description>
          {/* Ảnh lớn */}
          <Image
            src={selectedImage || '/images/no-image.webp'}
            width={300}
            height={300}
            alt="Full Image"
            className="w-full h-full object-contain rounded-lg"
            unoptimized
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
