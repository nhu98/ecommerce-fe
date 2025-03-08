'use client';
import React, { useEffect, useState } from 'react';
import {
  AddBrandFormData,
  BrandResponse,
  BrandsApiResponse,
  CategoryResponse,
  DeleteBrandApiResponse,
  UpdateBrandApiResponse,
} from '@/schemaValidation/auth.schema';
import { del, get, post, put } from '@/lib/http-client';
import PaginationComponent from '@/app/components/pagination';
import BrandCard from '@/app/admin/brands/components/brand-card';
import { toast } from '@/components/ui/use-toast';
import SearchBox from '@/app/admin/accounts/components/search-box';
import { Plus } from 'lucide-react';
import AddModal from '@/app/admin/brands/components/add-modal';
import UpdateModal from '@/app/admin/brands/components/update-modal';
import LoaderComponent from '@/app/components/loader';

export default function Brands() {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [valueSearch, setValueSearch] = useState('');

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<CategoryResponse>();

  useEffect(() => {
    const fetchBrands = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<BrandsApiResponse>('/brand/get', {
          search: valueSearch,
          page: currentPage.toString(),
        });

        if (result?.brands.length === 0) {
          setBrands([]);
        } else if (result?.brands && result?.totalPages) {
          setBrands(result?.brands);
          setTotalPages(result?.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands().then();
  }, [currentPage, valueSearch]);

  const reMoveBrand = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await del<DeleteBrandApiResponse>(
        `/brand/delete?id=${id}`,
      );

      if (result.message) {
        toast({
          title: 'Thông báo',
          description: result.message,
          variant: 'success',
          duration: 3000,
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandById = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await get<BrandResponse>('/brand/getById', {
        id: id,
      });
      if (result?.id) {
        setBrands([result]);
        setTotalPages(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = (value: string) => {
    if (value) {
      fetchBrandById(value.trim()).then();
    } else {
      window.location.reload();
    }
  };

  const handleSearchByKey = (value: string) => {
    if (value) {
      setValueSearch(value.trim());
    } else {
      setValueSearch('');
    }
  };

  const onAddBrandSubmit = async (data: AddBrandFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await post<BrandResponse>('/brand/create', {
        name: data.name,
      });

      if (result?.id) {
        setOpenAddModal(false);
        toast({
          title: 'Success',
          description: 'Thêm thương hiệu thành công!',
          variant: 'success',
          duration: 3000,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error('Error during Add Brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateBrandSubmit = async (data: AddBrandFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await put<UpdateBrandApiResponse>(
        `/brand/update?id=${selectedItem?.id}`,
        {
          name: data.name,
        },
      );

      if (result?.result?.id) {
        setOpenUpdateModal(false);
        toast({
          title: 'Success',
          description: 'Cập nhật thương hiệu thành công!',
          variant: 'success',
          duration: 3000,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error('Error during Update Brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBrand = async (item: BrandResponse) => {
    setSelectedItem(item);
    setOpenUpdateModal(true);
  };

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (brands.length === 0) {
      return <p>Thương hiệu sản phẩm rỗng.</p>;
    }

    return (
      <div>
        {brands.map((brand) => (
          <BrandCard
            item={brand}
            key={brand.id}
            handleUpdate={handleUpdateBrand}
            handleRemove={(id) => {
              reMoveBrand(id).then();
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
    <div className="relative w-full min-h-[50vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <h2 className="text-2xl font-bold mb-4">
          Quản lý Thương hiệu sản phẩm
        </h2>

        <div className="w-full flex flex-col md:justify-between md:flex-row gap-4 mb-4">
          <div className="flex flex-col md:justify-between md:flex-row gap-4">
            <div className="flex items-end">
              <SearchBox
                onSearch={handleSearchById}
                placeholder={'Tìm kiếm theo mã...'}
              />
            </div>

            <div className="flex items-end">
              <SearchBox
                onSearch={handleSearchByKey}
                placeholder={'Tìm kiếm theo tên...'}
              />
            </div>
          </div>

          <AddModal
            open={openAddModal}
            setOpen={setOpenAddModal}
            isLoading={loading}
            title="Thêm thương hiệu"
            childrenTrigger={
              <div className="flex items-center cursor-pointer border border-green-500 py-2 px-4 rounded-lg hover:bg-green-500 hover:text-white">
                <Plus color={'green'} size={16} className="mr-1" />
                <p>Thêm thương hiệu</p>
              </div>
            }
            onSubmit={onAddBrandSubmit}
          />
        </div>

        {renderContent()}
      </div>
      {loading && <LoaderComponent />}

      <UpdateModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        title={'Cập nhật thông tin thương hiệu'}
        value={selectedItem?.name || ''}
        description={`Thương hiệu có mã là ${selectedItem?.id}`}
        onSubmit={onUpdateBrandSubmit}
        isLoading={loading}
      />
    </div>
  );
}
