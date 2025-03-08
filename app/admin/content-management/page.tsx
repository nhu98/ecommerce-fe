'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ShopDataApiResponse,
  UpdateContentFormData,
  UpdateContentResponse,
  updateContentSchema,
} from '@/schemaValidation/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { get, putWithFormData } from '@/lib/http-client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import LoaderComponent from '@/app/components/loader';
import { Textarea } from '@/components/ui/textarea';

export default function ContentManagement() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateContentFormData>({
    resolver: zodResolver(updateContentSchema),
  });

  useEffect(() => {
    const fetchShopData = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<ShopDataApiResponse>('/shop/get');

        if (result?.intro) {
          setValue('intro', result.intro);
          setValue('question', result.question);
          setValue('contact', result.contact);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData().then();
  }, [setValue]);

  const onSubmitForm = async (data: UpdateContentFormData) => {
    const formData = new FormData();
    formData.append('intro', data.intro);
    formData.append('question', data.question);
    formData.append('contact', data.contact);

    if (loading) return;
    setLoading(true);
    try {
      const result: UpdateContentResponse = await putWithFormData(
        '/shop/update',
        formData,
      );

      if (result?.result?.intro) {
        toast({
          title: 'Success',
          description: 'Cập nhật nội dung cửa hàng thành công!',
          variant: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật nội dung cửa hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[50vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý nội dung</h2>

        <div>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="name">{'Giới thiệu'}</Label>
              <Textarea
                id="intro"
                {...register('intro')}
                placeholder="Nhập giới thiệu"
                disabled={loading}
              />
              {errors.intro && (
                <p className="text-red-500">{errors.intro.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="question">{'Câu hỏi'}</Label>
              <Textarea
                id="question"
                {...register('question')}
                placeholder="Nhập câu hỏi"
                disabled={loading}
              />
              {errors.question && (
                <p className="text-red-500">{errors.question.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="contact">{'Liên hệ'}</Label>
              <Textarea
                id="contact"
                {...register('contact')}
                placeholder="Nhập liên hệ"
                disabled={loading}
              />
              {errors.contact && (
                <p className="text-red-500">{errors.contact.message}</p>
              )}
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
