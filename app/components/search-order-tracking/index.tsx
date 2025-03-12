'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const TrackingForm: React.FC = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const pathname = usePathname();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^(0[2-9][0-9]{8,9})$/; // Regex cho số điện thoại Việt Nam

    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumber('');
      toast({
        title: 'Không đúng định dạng',
        description: `Vui lòng nhập đúng định dạng số điện thoại.`,
        variant: 'warning',
        duration: 3000,
      });
      return;
    }

    router.push(`/tracking?phone=${phoneNumber}`);
  };

  return (
    <>
      {pathname.startsWith('/admin') ? null : (
        <div className="bg-gray-100 p-8 rounded-lg">
          <h2 className="flex justify-center items-center text-xl mb-4">
            TRA CỨU MÃ VẬN ĐƠN VÀ HÀNH TRÌNH VẬN CHUYỂN
          </h2>
          <form onSubmit={handleSubmit} className="flex items-center">
            <Input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-l w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
              placeholder="Nhập số điện thoại vào đây"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-xs text-white py-2 px-1 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              TÌM KIẾM
            </button>
          </form>
          {/*<p className="flex justify-center items-center mt-4 text-gray-500">*/}
          {/*  Hotline hỗ trợ vận đơn: 0911 910 210 (Hỗ trợ tra mã vận đơn chuyển*/}
          {/*  phát)*/}
          {/*</p>*/}
        </div>
      )}
    </>
  );
};

export default TrackingForm;
