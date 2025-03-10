import { get } from '@/lib/http-client';
import { UserDataType } from '@/schemaValidation/auth.schema';
import { toast } from '@/components/ui/use-toast';
import { writeLocalUser } from '@/lib/utils';

export const getUerInfo = async (phoneNumber: string) => {
  try {
    const getMeRes = await get<UserDataType>('/users/getByPhone', {
      phone: phoneNumber,
    });

    if (!getMeRes.phone) {
      toast({
        title: 'Lỗi',
        description: 'Lấy thông tin người dùng không thành công!',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    } else {
      writeLocalUser(getMeRes);
      return;
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const sendTokenToNextServer = async (token: string) => {
  try {
    await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.log('error', error);
  }
};
