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
import { UserRound } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInCard from '@/app/components/sign-in-card';
import SignUpCard from '@/app/components/sign-up-card';

const AuthModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 cursor-pointer transition-all duration-500 mr-2">
          <UserRound size={18} />
        </div>
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account" className="">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="signin">{'Đăng nhập'}</TabsTrigger>
            <TabsTrigger value="signup">{'Đăng ký'}</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignInCard onClose={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpCard onClose={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
