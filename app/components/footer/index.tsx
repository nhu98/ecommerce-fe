'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { ShopDataApiResponse } from '@/schemaValidation/auth.schema';
import { get } from '@/lib/http-client';
import { isValue } from '@/lib/utils';

const baseUrl = 'http://14.225.206.204:3001';

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
        <div className="flex  flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and description */}
          <div className="w-full self-start mb-4 md:mb-0">
            <div className="flex items-center">
              <Image
                src={
                  shopData?.logo
                    ? `${baseUrl}/imgs/shop/${shopData?.logo}`
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
              <a href="https://www.facebook.com/profile.php?id=100054357258523">
                <Facebook className="text-gray-500 hover:text-blue-500 mr-2" />
              </a>
              <Twitter className="text-gray-500 hover:text-blue-500 mr-2" />
              <Instagram className="text-gray-500 hover:text-pink-500 mr-2" />
              <Linkedin className="text-gray-500 hover:text-blue-500" />
            </div>
          </div>

          {/* Các liên kết */}
          <div className="w-full self-start flex flex-col md:flex-row ">
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

          {/* Google Maps */}
          <div className="w-full self-start">
            <h4 className="font-bold mb-2">ĐỊA CHỈ</h4>
            <div className="w-full h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.4068461813326!2d108.94729807550728!3d11.594315988608573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3170d089def56555%3A0x9f56dc5c5e948e3!2zODExIDIxIFRow6FuZyA4LCDEkMO0IFZpbmgsIFBoYW4gUmFuZy1UaMOhcCBDaMOgbSwgTmluaCBUaHXhuq1uLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2sus!4v1741925661367!5m2!1svi!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
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
