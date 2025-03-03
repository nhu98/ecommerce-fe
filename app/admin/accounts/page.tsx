'use client';
import React, { useEffect, useState } from 'react';
import {
  DeleteUserApiResponse,
  UserApiResponse,
  UserDataType,
} from '@/schemaValidation/auth.schema';
import { del, get } from '@/lib/http-client';
import AccountCard from '@/app/admin/accounts/components/account-card';
import PaginationComponent from '@/app/components/pagination';
import { toast } from '@/components/ui/use-toast';
import SearchBox from '@/app/admin/accounts/components/search-box';
import LoaderComponent from '@/app/components/loader';

export default function Accounts() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserDataType[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await get<UserApiResponse>('/users/get', {
        page: currentPage.toString(),
      });

      if (result?.users.length === 0) {
        setUsers([]);
      } else if (result?.users && result?.totalPages) {
        setUsers(result?.users);
        setTotalPages(result?.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserByPhone = async (phoneNumber: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await get<UserDataType>('/users/getByPhone', {
        phone: phoneNumber,
      });
      if (result?.phone) {
        setUsers([result]);
        setTotalPages(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const reMoveAccount = async (phone: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await del<DeleteUserApiResponse>(
        `/users/delete?phone=${phone}`,
      );

      if (result.message) {
        toast({
          title: 'Thông báo',
          description: result.message,
          variant: 'success',
          duration: 3000,
        });
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue) {
      fetchUserByPhone(numericValue);
    } else {
      fetchUsers();
    }
  };

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (users.length === 0) {
      return <p>Danh sách tài khoản rỗng.</p>;
    }

    return (
      <div>
        {users.map((user) => (
          <AccountCard
            item={user}
            key={user.phone}
            handleRemove={(phoneNumber) => {
              reMoveAccount(phoneNumber);
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
        <h2 className="text-2xl font-bold mb-4">Quản lý tài khoản</h2>

        <div className="mb-4">
          <SearchBox
            onSearch={handleSearch}
            placeholder={'Tìm kiếm theo số điện thoại ...'}
          />
        </div>

        {renderContent()}
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
