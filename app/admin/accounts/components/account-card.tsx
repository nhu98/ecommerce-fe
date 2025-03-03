import React from 'react';
import { X } from 'lucide-react';
import { UserDataType } from '@/schemaValidation/auth.schema';
import { AvatarUser } from '@/app/components/user-avatar';
import ConfirmModal from '@/app/components/confirm-modal';

interface AccountCardProps {
  item: UserDataType;
  handleRemove: (phoneNumber: string) => void;
}

const AccountCard = ({ item, handleRemove }: AccountCardProps) => {
  return (
    <div
      key={item.phone}
      className="flex w-full justify-between items-center mb-4 p-2 border-b"
    >
      <div>
        <AvatarUser className="h-16 w-16" url="" />
      </div>

      <div className="w-1/2 break-words">
        <h3 className="font-medium">{item.phone}</h3>
        <p className="text-gray-500">{item.email}</p>
        <p className="text-gray-500">{item.name}</p>
        <p className="text-gray-500">{`${item.city}, ${item.district}, ${item.ward}, ${item.street}`}</p>
      </div>

      <ConfirmModal
        childrenTrigger={
          <div>
            <div className="border rounded-md py-2 px-4 ml-auto shadow-2xl text-gray-500 hover:text-red-500">
              <X size={20} />
            </div>
          </div>
        }
        title={'Xác nhận xoá tài khoản'}
        handleConfirm={() => handleRemove(item.phone)}
      />
    </div>
  );
};

export default AccountCard;
