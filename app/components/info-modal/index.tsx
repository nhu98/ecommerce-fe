'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CallMeIcon from '@/app/components/icons/call-me';
import { PulsatingButton } from '@/components/magicui/pulsating-btn';
import ZaloIcon from '@/app/components/icons/zalo';

interface ConfirmModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  childrenTrigger?: React.ReactNode;
  id?: string;
}

const InfoModal = ({
  open,
  setOpen,
  childrenTrigger,
  id,
}: ConfirmModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{childrenTrigger}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-green-500">
            Đặt hàng thành công!
          </DialogTitle>
          <DialogDescription>
            Để kiểm tra trạng thái đơn hàng vui lòng truy cập trang quản lý đơn
            hàng của bạn với mã đơn hàng: {id}
          </DialogDescription>
          <div className="flex flex-col items-center justify-center gap-4">
            Liên hệ với chúng tôi để tiếp tục quá trình thanh toán!
            <p>096.2486.085(Huy) - 0974.550.638(Giang)</p>
            <p>Zalo: 096.2486.085</p>
            <div className="flex flex-row gap-4">
              <PulsatingButton>
                <a
                  href="tel:+84962486085"
                  className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-300  transition"
                >
                  <CallMeIcon />
                </a>
              </PulsatingButton>

              <PulsatingButton>
                <a
                  href="https://zalo.me/0962486085"
                  className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-300  transition"
                >
                  <ZaloIcon className="w-24 h-24" />
                </a>
              </PulsatingButton>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
