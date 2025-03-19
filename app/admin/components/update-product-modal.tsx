'use client';
import React, { useEffect, useRef, useState } from 'react';
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
  addProductSchema,
  ProductResponse,
  UpdateProductApiResponse,
  UpdateProductFormData,
} from '@/schemaValidation/auth.schema';
import { Label } from '@/components/ui/label';
import CategorySelect from '@/app/admin/components/category-select';
import BrandSelect from '@/app/admin/components/brand-select';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { putWithFormData } from '@/lib/http-client';
import { toast } from '@/components/ui/use-toast';
import { Description } from '@radix-ui/react-dialog';
import Webcam from 'react-webcam';

const baseUrl = 'https://be.sondiennuoc.vn';

interface UpdateModalProps {
  item: ProductResponse;
  childrenTrigger?: React.ReactNode;
  title?: string;
  description?: string;
  handleRefresh: () => void;
}

const UpdateProductModal = ({
  item,
  childrenTrigger,
  title,
  description,
  handleRefresh,
}: UpdateModalProps) => {
  const [open, setOpen] = useState(false);
  const [openImgDialog, setOpenImgDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [openWebcam, setOpenWebcam] = useState(Array(5).fill(false));
  const webcamRefs = useRef<(Webcam | null)[]>([]);

  const [previewImages, setPreviewImages] = useState<(string | null)[]>(
    Array(5).fill(null),
  );
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(addProductSchema),
  });

  useEffect(() => {
    if (item) {
      setValue('name', item.name || '');
      setValue('brand_id', item.brand_id || '');
      setValue('category_id', item.category_id || '');
      setValue('detail', item.detail || '');
      setValue('price', item.price.toLocaleString('vi-VN') || '');

      const newPreviewImages = Array(5).fill(null);
      for (let i = 1; i <= 5; i++) {
        const imgField = `img${i}` as keyof ProductResponse;
        if (item[imgField]) {
          newPreviewImages[i - 1] =
            `${baseUrl}/imgs/products/${item[imgField]}`;
        }
      }
      setPreviewImages(newPreviewImages);
    }
  }, [item, setValue]);

  useEffect(() => {
    fileInputRefs.current = Array(5)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>().current);

    webcamRefs.current = Array(5).fill(null);
  }, []);

  const handleNumberInput = (field: 'price', value: string) => {
    const sanitizedValue = value.replace(/\D/g, '');
    const formattedValue = Number(sanitizedValue).toLocaleString('vi-VN');
    setValue(field, formattedValue, { shouldValidate: true });
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImages((prev) => {
          const newPreviewImages = [...prev];
          newPreviewImages[index] = imageUrl;
          return newPreviewImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (index: number) => {
    setPreviewImages((prev) => {
      const newPreviewImages = [...prev];
      newPreviewImages[index] = null;
      return newPreviewImages;
    });
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = '';
    }
    // Add to imagesToDelete if the cleared image was a default one
    if (item[`img${index + 1}` as keyof ProductResponse]) {
      setImagesToDelete((prev) => [...prev, `img${index + 1}`]);
    }
  };

  const handleCapture = (index: number) => {
    const webcam = webcamRefs.current[index];
    if (webcam) {
      const imageSrc = webcam.getScreenshot();
      if (imageSrc) {
        setPreviewImages((prev) => {
          const newPreviewImages = [...prev];
          newPreviewImages[index] = imageSrc;
          return newPreviewImages;
        });
        // Chuyển imageSrc thành Blob hoặc File và lưu vào fileInputRefs
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], `captured-image-${index}.png`, {
              type: 'image/png',
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (fileInputRefs.current[index]) {
              fileInputRefs.current[index].files = dataTransfer.files;
            }
          });
      }
    }
    setOpenWebcam((prev) => {
      const newOpenWebcam = [...prev];
      newOpenWebcam[index] = false;
      return newOpenWebcam;
    });
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const onSubmitForm = async (data: UpdateProductFormData) => {
    if (item?.id) {
      const formData = new FormData();
      formData.append('id', item.id.toString());
      formData.append('name', data.name);
      formData.append('brand_id', data.brand_id);
      formData.append('category_id', data.category_id);
      formData.append('detail', data.detail);
      formData.append('price', data.price.toString());
      fileInputRefs.current.forEach((ref, index) => {
        if (ref && ref.files && ref.files[0]) {
          formData.append(`img${index + 1}`, ref.files[0]);
        }
      });

      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      if (loading) return;
      setLoading(true);
      try {
        const result: UpdateProductApiResponse = await putWithFormData(
          '/product/update',
          formData,
        );

        if (result?.result?.id) {
          handleRefresh();
          setOpen(false);
          toast({
            title: 'Thành công',
            description: 'Cập nhật product thành công!',
            variant: 'success',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{childrenTrigger}</DialogTrigger>

        <DialogContent className="">
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="name">{'Tên sản phẩm'}</Label>
              <Input
                id="name"
                disabled={loading}
                placeholder="Nhập tên sản phẩm"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="brand_id">{'Thương hiệu sản phẩm'}</Label>
              <BrandSelect
                onChange={(value) => {
                  setValue('brand_id', value.id);
                }}
                register={register}
                name="brand_id"
                disabled={loading}
                defaultValue={item?.brand_id}
              />
              {errors.brand_id && (
                <p className="text-red-500">{errors.brand_id.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="category_id">{'Danh mục sản phẩm'}</Label>
              <CategorySelect
                onChange={(value) => {
                  setValue('category_id', value.id);
                }}
                register={register}
                name="category_id"
                disabled={loading}
                defaultValue={item?.category_id}
              />
              {errors.category_id && (
                <p className="text-red-500">{errors.category_id.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="price">{'Giá sản phẩm'}</Label>
              <Input
                {...register('price')}
                placeholder="Nhập giá sản phẩm"
                onChange={(e) => handleNumberInput('price', e.target.value)}
                disabled={loading}
              />
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="detail">{'Chi tiết sản phẩm'}</Label>
              <Textarea
                {...register('detail')}
                placeholder="Nhập chi tiết sản phẩm"
                disabled={loading}
              />
              {errors.detail && (
                <p className="text-red-500">{errors.detail.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label>{'Hình ảnh sản phẩm'}</Label>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {previewImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col items-center ${index === 0 ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
                  >
                    <Image
                      src={image || '/images/no-image.webp'}
                      alt={`img${index + 1}`}
                      width={index === 0 ? 160 : 80}
                      height={index === 0 ? 160 : 80}
                      onClick={() => {
                        setSelectedImage(image);
                        setOpenImgDialog(true);
                      }}
                      className={`w-full h-full rounded-lg object-cover cursor-pointer${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />

                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        ref={(el) => {
                          if (el) {
                            fileInputRefs.current[index] = el;
                          }
                        }}
                        id={`img${index + 1}`}
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={(event) => handleFileChange(event, index)}
                        className="hidden"
                      />

                      <div
                        className={`${index === 0 ? 'flex flex-col md:flex-row' : 'flex flex-col'} gap-2`}
                      >
                        <div className=" flex flex-row items-center gap-2">
                          <label
                            onClick={() => {
                              setOpenWebcam((prev) => {
                                const newOpenWebcam = [...prev];
                                newOpenWebcam[index] = true;
                                return newOpenWebcam;
                              });
                            }}
                            className={`text-sm bg-green-500 text-white px-2 py-1 rounded cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Chụp ảnh {index + 1}
                          </label>

                          <label
                            htmlFor={`img${index + 1}`}
                            className={`text-sm bg-blue-500 text-white px-2 py-1 rounded cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''} `}
                          >
                            Chọn hình {index + 1}
                          </label>

                          {/*{image && (*/}
                          {/*  <span className="text-sm text-gray-600 truncate max-w-[100px]">*/}
                          {/*    {fileInputRefs.current[index]?.files?.[0]?.name ||*/}
                          {/*      ''}*/}
                          {/*  </span>*/}
                          {/*)}*/}
                        </div>

                        <label
                          onClick={() => handleClearImage(index)}
                          className={`text-sm bg-red-500 text-white px-2 py-1 rounded cursor-pointer text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Bỏ chọn
                        </label>
                      </div>
                    </div>

                    {openWebcam[index] && (
                      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-85 flex items-center justify-center">
                        <div className="relative">
                          <Webcam
                            audio={false}
                            ref={(el) => {
                              if (el) {
                                webcamRefs.current[index] = el;
                              }
                            }}
                            screenshotFormat="image/png"
                            width={420}
                            height={340}
                            mirrored={facingMode === 'user'}
                            videoConstraints={{ facingMode }}
                            className="rounded-lg"
                          />
                          <div className="flex justify-center mt-2">
                            <Button
                              type="button"
                              onClick={toggleCamera}
                              className="px-2 bg-gray-500 text-white rounded mr-2"
                            >
                              Đổi Camera
                            </Button>

                            <Button
                              onClick={() => handleCapture(index)}
                              className="text-sm bg-blue-500 text-white px-2 rounded mr-2 w-14"
                              type="button"
                            >
                              Chụp
                            </Button>
                            <Button
                              onClick={() => {
                                setOpenWebcam((prev) => {
                                  const newOpenWebcam = [...prev];
                                  newOpenWebcam[index] = false;
                                  return newOpenWebcam;
                                });
                              }}
                              className="text-sm bg-gray-500 text-white px-2 rounded w-14"
                              type="button"
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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
        </DialogContent>
      </Dialog>

      <Dialog open={openImgDialog} onOpenChange={setOpenImgDialog}>
        <DialogTrigger asChild></DialogTrigger>
        {/* Modal */}
        <DialogContent className="!max-w-2xl flex flex-col items-center bg-transparent border-0 shadow-none p-0">
          <DialogTitle className="m-4"></DialogTitle>
          <Description></Description>
          {/* Ảnh lớn */}
          <Image
            src={selectedImage || '/images/no-image.webp'}
            width={300}
            height={300}
            alt="Full Image"
            className="w-full h-auto rounded-lg object-cover"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateProductModal;
