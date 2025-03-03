'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  childrenTrigger?: React.ReactNode;
  title?: string;
  description?: string;
  handleConfirm?: () => void;
}

const ConfirmModal = ({
  childrenTrigger,
  title,
  description,
  handleConfirm,
}: ConfirmModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{childrenTrigger}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-row gap-2">
          <Button
            className="w-full hover:bg-red-500 hover:text-white"
            variant="outline"
            onClick={() => {
              setOpen(false);
              if (handleConfirm) {
                handleConfirm();
              }
            }}
          >
            Có
          </Button>
          <Button
            className="w-full hover:bg-red-500 hover:text-white"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Không
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
