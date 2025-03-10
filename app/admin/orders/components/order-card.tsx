import React, { useState } from 'react';
import { X } from 'lucide-react';
import { OrderResponse } from '@/schemaValidation/auth.schema';
import { formatDate, formatPrice } from '@/lib/utils';
import ConfirmModal from '@/app/components/confirm-modal';
import UpdateStatusModal from '@/app/admin/orders/components/update-status-modal';

interface OrderCardProps {
  item: OrderResponse;
  handleRemove: (id: string) => void;
}

const OrderCard = ({ item, handleRemove }: OrderCardProps) => {
  const renderStatus = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Đang chờ';
      case 'processing':
        return 'Đang xử lý';
      case 'delivering':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'canceled':
        return 'Đã huỷ';
      default:
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        key={item.id}
        className="flex flex-col md:flex-row w-full gap-2 md:gap-0 md:justify-between md:items-center mb-4 p-2 border-b cursor-pointer"
      >
        <div
          onClick={() => setOpen(true)}
          className="text-sm w-2/3 break-words mr-4 md:text-base"
        >
          <h3 className="font-medium">Mã đơn hàng: {item.id}</h3>
          <p className="text-gray-500">Ngày đặt: {formatDate(item.date)}</p>
          <p className="text-gray-500">SĐT Khách: {item.customer_phone}</p>
          <p className="text-gray-500">
            Địa chỉ:
            {` ${item.city}, ${item.district}, ${item.ward}, ${item.street}`}
          </p>
        </div>

        <div
          onClick={() => setOpen(true)}
          className="text-sm w-2/3 break-words md:text-base"
        >
          <p className="text-gray-500">
            Trạng thái: {renderStatus(item.status)}
          </p>
          <p className="text-gray-500">
            Trạng thái thanh toán:
            {item.payment_status === 0 ? ' Chưa thanh toán' : ' Đã thanh toán'}
          </p>
          <p className="text-gray-500">Tổng cộng: {formatPrice(item.price)}</p>
          <p className="text-gray-500">
            Phí vận chuyển: {formatPrice(item.ship_price)}
          </p>
          <p className="text-gray-500">
            Giảm giá: {formatPrice(item.discount)}
          </p>

          {item.products
            ? item.products.map((product) => {
                return (
                  <p key={product.product_id} className="text-gray-500">
                    {product.product_name}, SL: {product.quantity}
                  </p>
                );
              })
            : ''}
        </div>

        <ConfirmModal
          childrenTrigger={
            <div>
              <div className="flex items-center justify-center border rounded-md py-2 px-4 ml-auto shadow-2xl text-gray-500 hover:text-red-500">
                <X size={20} />
              </div>
            </div>
          }
          title={'Xác nhận xoá đơn đặt hàng'}
          handleConfirm={() => handleRemove(item.id)}
        />
      </div>
      <UpdateStatusModal
        open={open}
        setOpen={setOpen}
        orderId={item.id}
        defaultStatus={item.status}
        defaultPaymentStatus={item.payment_status.toString()}
        defaultShipPrice={item.ship_price}
      />
    </>
  );
};

export default OrderCard;
