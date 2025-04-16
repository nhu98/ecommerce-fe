'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BlurFade from '@/components/magicui/blur-fade';
import { ShopDataApiResponse } from '@/schemaValidation/auth.schema';
import { get } from '@/lib/http-client';
import { isValue } from '@/lib/utils';

const baseUrl = 'https://be.sondiennuoc.vn';

const Banner = () => {
  const [shopData, setShopData] = useState<ShopDataApiResponse>();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const result = await get<ShopDataApiResponse>('/shop/get');

        if (isValue(result)) {
          setShopData(result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchShopData().then();
  }, []);

  return (
    <BlurFade delay={0} duration={2} inView>
      <section id="banner" className={`relative h-[485px] md:h-[575px]`}>
        <Image
          priority
          src={
            shopData?.banner1
              ? `${baseUrl}/imgs/shop/${shopData?.banner1}`
              : '/images/no-image.webp'
          }
          fill
          sizes={'(max-width: 768px) 100vw, 50vw'}
          alt={'banner'}
          style={{ padding: 10 }}
          className="object-cover rounded-2xl"
          unoptimized
        />
        {/*<div className="absolute inset-0 flex flex-col items-center  text-center justify-between pt-[40px] md:pt-[80px]">*/}
        {/*  <div className="flex flex-col px-6">*/}
        {/*    <div className="flex-grow text-left"></div>*/}
        {/*    <h1 className="text-4xl  md:text-7xl font-extrabold text-blue-600 mx-auto my-2">*/}
        {/*      {'ABC'}*/}
        {/*    </h1>*/}
        {/*    <div className="flex-grow text-right">*/}
        {/*      <p className="text-[14px] w-[228px] md:text-[16px] md:w-[400px] font-semibold ml-auto text-red-500">*/}
        {/*        {'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </section>
    </BlurFade>
  );
};

export default Banner;
