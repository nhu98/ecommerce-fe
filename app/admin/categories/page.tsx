'use client';
import React, { useEffect, useState } from 'react';
import {
  AddCategoryFormData,
  CategoriesApiResponse,
  CategoryResponse,
  DeleteCategoryApiResponse,
  UpdateCategoryApiResponse,
} from '@/schemaValidation/auth.schema';
import LoaderComponent from '@/app/components/loader';
import { del, get, post, put } from '@/lib/http-client';
import PaginationComponent from '@/app/components/pagination';
import CategoryCard from '@/app/admin/categories/components/category-card';
import { toast } from '@/components/ui/use-toast';
import SearchBox from '@/app/admin/accounts/components/search-box';
import { Plus } from 'lucide-react';
import AddModal from '@/app/admin/categories/components/add-modal';
import UpdateModal from '@/app/admin/categories/components/update-modal';

export default function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [valueSearch, setValueSearch] = useState('');

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<CategoryResponse>();

  useEffect(() => {
    const fetchCategories = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<CategoriesApiResponse>('/category/get', {
          search: valueSearch,
          page: currentPage.toString(),
        });

        if (result?.categories.length === 0) {
          setCategories([]);
        } else if (result?.categories && result?.totalPages) {
          setCategories(result?.categories);
          setTotalPages(result?.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories().then();
  }, [currentPage, valueSearch]);

  const reMoveCategory = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await del<DeleteCategoryApiResponse>(
        `/category/delete?id=${id}`,
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

  const fetchCategoryById = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await get<CategoryResponse>('/category/getById', {
        id: id,
      });
      if (result?.id) {
        setCategories([result]);
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
      fetchCategoryById(value.trim()).then();
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

  const onAddCategorySubmit = async (data: AddCategoryFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await post<CategoryResponse>('/category/create', {
        name: data.name,
      });

      if (result?.id) {
        setOpenAddModal(false);
        toast({
          title: 'Thành công',
          description: 'Thêm danh mục thành công!',
          variant: 'success',
          duration: 3000,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error('Error during Add Category:', error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateCategorySubmit = async (data: AddCategoryFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await put<UpdateCategoryApiResponse>(
        `/category/update?id=${selectedItem?.id}`,
        {
          name: data.name,
        },
      );

      if (result?.result?.id) {
        setOpenUpdateModal(false);
        toast({
          title: 'Thành công',
          description: 'Cập nhật danh mục thành công!',
          variant: 'success',
          duration: 3000,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error('Error during Update Category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (item: CategoryResponse) => {
    setSelectedItem(item);
    setOpenUpdateModal(true);
  };

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (categories.length === 0) {
      return <p>Danh mục sản phẩm rỗng.</p>;
    }

    return (
      <div>
        {categories.map((category) => (
          <CategoryCard
            item={category}
            key={category.id}
            handleUpdate={handleUpdateCategory}
            handleRemove={(id) => {
              reMoveCategory(id).then();
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
    <div className="relative w-full min-h-[80vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý Danh mục sản phẩm</h2>

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
            title="Thêm danh mục"
            childrenTrigger={
              <div className="flex items-center cursor-pointer border border-green-500 py-2 px-4 rounded-lg hover:bg-green-500 hover:text-white">
                <Plus color={'green'} size={16} className="mr-1" />
                <p>Thêm danh mục</p>
              </div>
            }
            onSubmit={onAddCategorySubmit}
          />
        </div>

        {renderContent()}
      </div>
      {loading && <LoaderComponent />}

      <UpdateModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        title={'Cập nhật thông tin danh mục'}
        value={selectedItem?.name || ''}
        description={`Danh mục có mã là ${selectedItem?.id}`}
        onSubmit={onUpdateCategorySubmit}
        isLoading={loading}
      />
    </div>
  );
}
