'use client';
import React, { useEffect, useState } from 'react';
import {
  DeleteOrderApiResponse,
  OrderApiResponse,
  OrderResponse,
} from '@/schemaValidation/auth.schema';
import { del, get } from '@/lib/http-client';
import PaginationComponent from '@/app/components/pagination';
import OrderCard from '@/app/admin/orders/components/order-card';
import { toast } from '@/components/ui/use-toast';
import DatePickerComponent from '@/app/components/date-picker';
import { Label } from '@/components/ui/label';
import { formatDateToString } from '@/lib/utils';
import LoaderComponent from '@/app/components/loader';
import StatusSelect from '@/app/admin/orders/components/statust-select';
import SearchBox from '@/app/admin/accounts/components/search-box';
import { TooltipComponent } from '@/app/components/tooltip';
import { Ban } from 'lucide-react';
import PaymentStatusSelect from '@/app/admin/orders/components/payment-statust-select';

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [phoneValueSearch, setPhoneValueSearch] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [paymentStatusValue, setPaymentStatusValue] = useState('');

  const [dateToSelected, setDateToSelected] = useState<string>('');
  const [dateFromSelected, setDateFromSelected] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<OrderApiResponse>('/order/get', {
          phone: phoneValueSearch,
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
    };

    fetchOrders().then();
  }, [
    currentPage,
    dateToSelected,
    dateFromSelected,
    phoneValueSearch,
    statusValue,
    paymentStatusValue,
  ]);

  const reMoveOrder = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await del<DeleteOrderApiResponse>(
        `/order/delete?id=${id}`,
      );

      if (result.message) {
        toast({
          title: 'Thông báo',
          description: result.message,
          variant: 'success',
          duration: 3000,
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await get<OrderResponse>('/order/getById', {
        id: id,
      });
      if (result?.id) {
        setOrders([result]);
        setTotalPages(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = (value: string) => {
    if (value) {
      fetchOrderById(value.trim()).then();
    } else {
      window.location.reload();
    }
  };

  const handleSearchByPhone = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue) {
      setPhoneValueSearch(numericValue);
    } else {
      setPhoneValueSearch('');
    }
  };

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
          <OrderCard
            item={order}
            key={order.id}
            handleRemove={(id) => {
              reMoveOrder(id).then();
            }}
          />
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
        </div>
        <div className="w-full flex flex-col md:justify-between md:flex-row gap-4 mb-4">
          <div className="w-full flex items-end">
            <SearchBox
              onSearch={handleSearchById}
              placeholder={'Tìm kiếm theo mã...'}
            />
          </div>

          <div className="w-full flex items-end">
            <SearchBox
              onSearch={handleSearchByPhone}
              placeholder={'Tìm kiếm theo sdt...'}
            />
          </div>
        </div>

        <div className="flex mb-4">
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

        {renderContent()}
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
