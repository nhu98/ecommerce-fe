import React from 'react';
import { PencilLine, X } from 'lucide-react';
import { CategoryResponse } from '@/schemaValidation/auth.schema';
import ConfirmModal from '@/app/components/confirm-modal';

interface CategoryCardProps {
  item: CategoryResponse;
  handleRemove: (id: string) => void;
  handleUpdate: (item: CategoryResponse) => void;
}

const CategoryCard = ({
  item,
  handleRemove,
  handleUpdate,
}: CategoryCardProps) => {
  return (
    <div
      key={item.id}
      className="flex flex-col md:flex-row w-full gap-2 md:gap-0 md:justify-between md:items-center mb-4 p-2 border-b"
    >
      <div className="text-sm w-full break-words mr-4 md:text-base">
        <h3 className="font-medium">Mã danh mục: {item.id}</h3>
        <p className="text-gray-500">Tên danh mục: {item.name}</p>
      </div>

      <div className="flex flex-row gap-4">
        <div
          onClick={() => {
            handleUpdate(item);
          }}
        >
          <div className="flex items-center justify-center border rounded-md py-2 px-4 ml-auto shadow-2xl text-gray-500 hover:text-yellow-500">
            <PencilLine size={20} />
          </div>
        </div>

        <ConfirmModal
          childrenTrigger={
            <div>
              <div className="flex items-center justify-center border rounded-md py-2 px-4 ml-auto shadow-2xl text-gray-500 hover:text-red-500">
                <X size={20} />
              </div>
            </div>
          }
          title={'Xác nhận xoá danh mục'}
          handleConfirm={() => handleRemove(item.id)}
        />
      </div>
    </div>
  );
};

export default CategoryCard;
