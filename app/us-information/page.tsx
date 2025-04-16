'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { get } from '@/lib/http-client';
import { ShopDataApiResponse } from '@/schemaValidation/auth.schema';
import LoaderComponent from '@/app/components/loader';
import { isValue } from '@/lib/utils';

export default function UsInformation() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const [loading, setLoading] = useState(false);

  const [shopData, setShopData] = useState<ShopDataApiResponse>();

  useEffect(() => {
    const fetchShopData = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<ShopDataApiResponse>('/shop/get');

        if (isValue(result)) {
          setShopData(result);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData().then();
  }, [tab]);

  const renderContent = () => {
    if (loading) {
      return <></>;
    }

    return (
      <div className="w-full flex justify-center items-center">
        <pre className="text-lg" style={{ whiteSpace: 'pre-wrap' }}>
          {renderInformation()}
        </pre>
      </div>
    );
  };

  const renderInformation = () => {
    switch (tab) {
      case 'intro':
        return shopData?.intro;
      case 'question':
        return shopData?.question;
      case 'contact':
        return shopData?.contact;
      default:
        return '';
    }
  };

  const renderTitle = () => {
    switch (tab) {
      case 'intro':
        return '';
      case 'question':
        return 'Câu Hỏi Thường Gặp';
      case 'contact':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="w-full min-h-[80vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <div className="flex w-full flex-col justify-center items-center">
          <h1 className="text-2xl mb-4 font-bold">{renderTitle()}</h1>
          {renderContent()}
        </div>
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
