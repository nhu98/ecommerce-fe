'use client';
import React, { useEffect, useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { get } from '@/lib/http-client';
import {
  OrderApiResponse,
  OrderResponse,
} from '@/schemaValidation/auth.schema';
import LoaderComponent from '@/app/components/loader';
import PaginationComponent from '@/app/components/pagination';
import OrderCard from '@/app/tracking/components/order-card';

export default function Tracking() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');

  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<OrderApiResponse>('/order/get', {
          phone: phone || '',
          fromDate: '',
          toDate: '',
          status: '',
          payment_status: '',
          page: currentPage.toString(),
        });

        if (result?.orders.length === 0) {
          setOrders([]);
        } else if (result?.orders && result?.totalPages) {
          setOrders(result.orders);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders().then();
  }, [currentPage, phone]);

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (orders.length === 0) {
      return renderNotFound();
    }

    return (
      <div className="w-full md:w-2/3">
        {orders.map((order) => (
          <OrderCard item={order} key={order.id} />
        ))}
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  };

  const renderNotFound = () => {
    return (
      <>
        <TriangleAlert color={'red'} size={200} />
        <p className="text-lg">
          Không tìm thấy mã vận đơn được đặt hàng bằng số điện thoại
        </p>
        <p className="text-2xl text-red-500 my-4">{phone}</p>
        <p className="text-lg">
          - Số điện thoại phải nhập đúng chuẩn và gồm đầy đủ số (bao gồm cả số 0
          ở đầu)
        </p>
        <p className="text-lg">
          - Mã vận đơn được cập nhật lên website sau 1 ngày làm việc tính từ
          ngày gửi hàng
        </p>
      </>
    );
  };

  return (
    <div className="w-full min-h-[80vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <div className="flex w-full flex-col justify-center items-center">
          <h1 className="text-2xl">TRA CỨU ĐƠN HÀNG</h1>
          {renderContent()}
        </div>
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
