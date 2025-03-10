'use client';
import { useEffect, useState } from 'react';
import { get } from '@/lib/http-client';
import { UserDataType } from '@/schemaValidation/auth.schema';

export const useUser = (localUserPhone: string | undefined) => {
  const [user, setUser] = useState<UserDataType>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserByPhone = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<UserDataType>('/users/getByPhone', {
          phone: localUserPhone || '',
        });
        if (result?.phone) {
          setUser(result);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (localUserPhone) {
      fetchUserByPhone().then();
    }
  }, [localUserPhone]);

  return { user, loading, setLoading };
};
