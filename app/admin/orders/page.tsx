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
import SearchBox from '@/app/admin/accounts/components/search-box';
import LoaderComponent from '@/app/components/loader';

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [phoneValueSearch, setPhoneValueSearch] = useState('');

  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );

  const [dateToSelected, setDateToSelected] = useState<string>(
    formatDateToString(today),
  );
  const [dateFromSelected, setDateFromSelected] = useState<string>(
    formatDateToString(oneMonthAgo),
  );

  useEffect(() => {
    const fetchOrders = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<OrderApiResponse>('/order/get', {
          phone: phoneValueSearch,
          fromDate: dateFromSelected,
          toDate: dateToSelected,
          status: '',
          payment_status: '',
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
  }, [currentPage, dateToSelected, dateFromSelected, phoneValueSearch]);

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
    <div className="relative w-full">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý đơn đặt hàng</h2>
        <div className="w-full flex flex-col md:justify-between md:flex-row gap-4 mb-4">
          <div className="flex flex-col">
            <Label className="mb-2">Từ ngày:</Label>
            <DatePickerComponent
              handleValueChange={(value) => {
                setDateFromSelected(formatDateToString(value));
              }}
              defaultValue={oneMonthAgo}
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Đến ngày:</Label>
            <DatePickerComponent
              handleValueChange={(value) => {
                setDateToSelected(formatDateToString(value));
              }}
            />
          </div>

          <div className="flex items-end">
            <SearchBox
              onSearch={handleSearchById}
              placeholder={'Tìm kiếm theo mã...'}
            />
          </div>

          <div className="flex items-end">
            <SearchBox
              onSearch={handleSearchByPhone}
              placeholder={'Tìm kiếm theo tên...'}
            />
          </div>
        </div>

        {renderContent()}
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
