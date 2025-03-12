'use client';
import React, { useEffect, useState } from 'react';
import {
  OrderApiResponse,
  OrderResponse,
  UserDataType,
} from '@/schemaValidation/auth.schema';
import { get } from '@/lib/http-client';
import PaginationComponent from '@/app/components/pagination';
import DatePickerComponent from '@/app/components/date-picker';
import { Label } from '@/components/ui/label';
import { formatDateToString, getLocalUser } from '@/lib/utils';
import LoaderComponent from '@/app/components/loader';
import { TooltipComponent } from '@/app/components/tooltip';
import { Ban } from 'lucide-react';
import OrderCard from '@/app/order-management/components/order-card';
import PaymentStatusSelect from '@/app/order-management/components/payment-statust-select';
import StatusSelect from '@/app/order-management/components/statust-select';

export default function OrderManagement() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [statusValue, setStatusValue] = useState('');
  const [paymentStatusValue, setPaymentStatusValue] = useState('');

  const [dateToSelected, setDateToSelected] = useState<string>('');
  const [dateFromSelected, setDateFromSelected] = useState<string>('');

  const [localUser, setLocalUser] = useState<UserDataType | undefined>(
    undefined,
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalUser(getLocalUser());
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (localUser?.phone) {
        if (loading) return;
        setLoading(true);
        try {
          const result = await get<OrderApiResponse>('/order/get', {
            phone: localUser.phone,
            fromDate: dateFromSelected,
            toDate: dateToSelected,
            status: statusValue,
            payment_status: paymentStatusValue,
            page: currentPage.toString(),
          });

          if (result?.orders.length === 0) {
            setOrders([]);
          } else if (result?.orders && result?.totalPages) {
            setOrders(result?.orders);
            setTotalPages(result?.totalPages);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders().then();
  }, [
    localUser?.phone,
    currentPage,
    dateToSelected,
    dateFromSelected,
    statusValue,
    paymentStatusValue,
  ]);

  const handleChangeStatus = (value: { id: string; name: string }) => {
    if (value.id) {
      setStatusValue(value.id);
    }
  };

  const handleChangePaymentStatus = (value: { id: string; name: string }) => {
    if (value.id) {
      setPaymentStatusValue(value.id);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (orders.length === 0) {
      return <p>Danh sách đơn đặt hàng rỗng.</p>;
    }

    return (
      <div>
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

  return (
    <div className="relative w-full min-h-[80vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý đơn đặt hàng</h2>
        <div className="w-full flex flex-col md:justify-between md:flex-row gap-4 mb-4">
          <div className="w-full flex flex-col">
            <Label className="mb-2">Từ ngày:</Label>
            <DatePickerComponent
              handleValueChange={(value) => {
                setDateFromSelected(formatDateToString(value));
              }}
            />
          </div>

          <div className="w-full flex flex-col">
            <Label className="mb-2">Đến ngày:</Label>
            <DatePickerComponent
              handleValueChange={(value) => {
                setDateToSelected(formatDateToString(value));
              }}
            />
          </div>

          <div className="w-full flex items-end">
            <StatusSelect onChange={handleChangeStatus} />
          </div>

          <div className="w-full flex items-end">
            <PaymentStatusSelect onChange={handleChangePaymentStatus} />
          </div>

          <div className=" flex items-end">
            <TooltipComponent
              childrenTrigger={
                <div
                  onClick={() => window.location.reload()}
                  className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 cursor-pointer transition-all duration-500 mr-2"
                >
                  <Ban size={18} />
                </div>
              }
              content="Loại bỏ tìm kiếm và bộ lọc"
            />
          </div>
        </div>

        {renderContent()}
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
