'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { ShopDataApiResponse } from '@/schemaValidation/auth.schema';
import { get } from '@/lib/http-client';
import { isValue } from '@/lib/utils';
import envConfig from '@/config';

const baseUrl = envConfig.NEXT_PUBLIC_URL;

const Footer = () => {
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
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center">
          {/* Logo and description */}
          <div className="w-1/2 self-start mb-4 md:mb-0">
            <div className="flex items-center">
              <Image
                src={
                  shopData?.logo
                    ? `${baseUrl}/imgs/products/${shopData?.logo}`
                    : '/images/no-image.webp'
                }
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="ml-2 font-bold text-xl">{shopData?.name}</span>
            </div>
            <p className="text-gray-500 mt-2">{shopData?.sologan}</p>
            <div className="flex mt-4">
              <Facebook className="text-gray-500 hover:text-blue-500 mr-2" />
              <Twitter className="text-gray-500 hover:text-blue-500 mr-2" />
              <Instagram className="text-gray-500 hover:text-pink-500 mr-2" />
              <Linkedin className="text-gray-500 hover:text-blue-500" />
            </div>
          </div>

          {/* Các liên kết */}
          <div className="w-1/2 flex flex-col self-start md:flex-row ">
            {/*<div className="md:mr-16">*/}
            {/*  <h4 className="font-bold mb-2">ABOUT US</h4>*/}
            {/*  <ul className="text-gray-500">*/}
            {/*    <li>*/}
            {/*      <Link href="#">About</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link href="#">FAQ&#39;s</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</div>*/}
            {/*<div className="md:mr-16">*/}
            {/*  <h4 className="font-bold mb-2">INFORMATION</h4>*/}
            {/*  <ul className="text-gray-500">*/}
            {/*    <li>*/}
            {/*      <Link href="#">About</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link href="#">FAQ&#39;s</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</div>*/}
            <div className="flex flex-col">
              <h4 className="font-bold mb-2">VỀ CHÚNG TÔI</h4>
              <ul className="text-gray-500">
                <li className="hover:text-red-500">
                  <Link href="/us-information?tab=intro">Giới thiệu</Link>
                </li>
                <li className="hover:text-red-500">
                  <Link href="/us-information?tab=question">Câu hỏi</Link>
                </li>
                <li className="hover:text-red-500">
                  <Link href="/us-information?tab=contact">Liên hệ</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* More information */}
        <div className="mt-8 border-t border-gray-300 text-center text-gray-500">
          <p className="mt-4">Copyright © {shopData?.name} - 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
