import React from 'react';
import { PencilLine, X } from 'lucide-react';
import { ProductResponse } from '@/schemaValidation/auth.schema';
import { formatPrice } from '@/lib/utils';
import ConfirmModal from '@/app/components/confirm-modal';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import UpdateProductModal from '@/app/admin/components/update-product-modal';

interface ProductCardProps {
  item: ProductResponse;
  handleRemove: (id: string) => void;
  handleRefresh: () => void;
}

const baseUrl = 'https://be.sondiennuoc.vn';

const ProductCard = ({
  item,
  handleRemove,
  handleRefresh,
}: ProductCardProps) => {
  return (
    <div
      key={item.id}
      className="flex flex-col md:flex-row w-full gap-2 md:gap-0 md:justify-between md:items-center mb-4 p-2 border-b"
    >
      <div className="w-full md:w-1/3">
        <Image
          src={
            item.img1
              ? `${baseUrl}/imgs/products/${item.img1}`
              : '/images/no-image.webp'
          }
          alt={item.name}
          width={80}
          height={80}
          unoptimized
        />
        <Label className="font-semibold">{item.name}</Label>
      </div>

      <div className="text-sm w-full md:w-2/3break-words md:text-base">
        <p className="text-gray-500">Danh mục: {item.category_name}</p>
        <p className="text-gray-500">Thương hiệu: {item.brand_name}</p>
      </div>

      <div className="text-sm w-full md:w-2/3 break-words md:text-base">
        <p className="text-gray-500">Giá tiền: {formatPrice(item.price)}</p>
        <p className="text-gray-500 line-clamp-2">Chi tiết: {item.detail}</p>
      </div>

      <div className="flex w-full md:w-1/3 justify-center gap-2">
        <UpdateProductModal
          childrenTrigger={
            <div>
              <div className="flex items-center justify-center border rounded-md py-2 px-4 ml-auto shadow-2xl text-gray-500 hover:text-yellow-500">
                <PencilLine size={20} />
              </div>
            </div>
          }
          title={'Cập nhật sản phẩm'}
          item={item}
          handleRefresh={handleRefresh}
        />
        <ConfirmModal
          childrenTrigger={
            <div>
              <div className="flex items-center justify-center border rounded-md py-2 px-4 ml-auto shadow-2xl text-gray-500 hover:text-red-500">
                <X size={20} />
              </div>
            </div>
          }
          title={'Xác nhận xoá sản phẩm'}
          handleConfirm={() => handleRemove(item.id)}
        />
      </div>
    </div>
  );
};

export default ProductCard;
