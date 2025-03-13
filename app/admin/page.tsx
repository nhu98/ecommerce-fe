'use client';
import React, { useEffect, useState } from 'react';
import {
  DeleteProductApiResponse,
  FilterFormData,
  OrderApiResponse,
  ProductResponse,
  ProductsApiResponse,
} from '@/schemaValidation/auth.schema';
import PaginationComponent from '@/app/components/pagination';
import ProductCard from '@/app/admin/components/product-card';
import LoaderComponent from '@/app/components/loader';
import { del, get } from '@/lib/http-client';
import { toast } from '@/components/ui/use-toast';
import SearchBox from '@/app/admin/accounts/components/search-box';
import AddProductModal from '@/app/admin/components/add-product-modal';
import { Ban, Plus } from 'lucide-react';
import FiltersModel from '@/app/components/filters-modal';
import { TooltipComponent } from '@/app/components/tooltip';

export default function Product() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [categorySelected, setCategorySelected] = useState('');
  const [brandSelected, setBrandSelected] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [valueSearch, setValueSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await get<ProductsApiResponse>('/product/get', {
          search: valueSearch,
          category: categorySelected,
          brand: brandSelected,
          minPrice: minPrice,
          maxPrice: maxPrice,
          sortBy: sortBy,
          page: currentPage.toString(),
        });

        if (result?.products.length === 0) {
          setProducts([]);
        } else if (result?.products && result?.totalPages) {
          setProducts(result?.products);
          setTotalPages(result?.totalPages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().then();
  }, [
    currentPage,
    valueSearch,
    categorySelected,
    brandSelected,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  useEffect(() => {
    const intervalId = setInterval(checkNewOrders, 3000); // Gọi mỗi 3s

    return () => clearInterval(intervalId);
  }, []);

  const checkNewOrders = async () => {
    try {
      const result = await get<OrderApiResponse>('/order/get', {
        phone: '',
        fromDate: '',
        toDate: '',
        status: 'waiting',
        payment_status: '',
        page: '1',
      });

      if (result?.orders && result?.orders.length > 0) {
        const firstOrderId = localStorage.getItem('firstOrderId') || '';
        if (
          result.orders[0].id !== firstOrderId &&
          result.orders[0].status === 'waiting'
        ) {
          toast({
            title: 'Thông báo',
            description: `Có đơn hàng mới với mã đơn hàng ${result.orders[0].id}`,
            variant: 'success',
            duration: 5000,
          });

          // Cập nhật localStorage với ID đơn hàng mới
          localStorage.setItem('firstOrderId', result.orders[0].id);
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra đơn hàng mới:', error);
    }
  };

  const reMoveProduct = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await del<DeleteProductApiResponse>(
        `/product/delete?id=${id}`,
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

  const fetchProductById = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await get<ProductResponse>('/product/getById', {
        id: id,
      });
      if (result?.id) {
        setProducts([result]);
        setTotalPages(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = (value: string) => {
    if (value && value.trim().length > 0) {
      fetchProductById(value.trim()).then();
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

  const renderContent = () => {
    if (loading) {
      return <></>;
    } else if (products.length === 0) {
      return <p>Danh sách sản phẩm rỗng.</p>;
    }

    return (
      <div>
        {products.map((product) => (
          <ProductCard
            item={product}
            key={product.id}
            handleRemove={(id) => {
              reMoveProduct(id).then();
            }}
            handleRefresh={handleRefresh}
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

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFilter = (data: FilterFormData) => {
    setCategorySelected(data.categoryId || '');
    setBrandSelected(data.brandId || '');
    setMinPrice(data.from || '');
    setMaxPrice(data.to || '');
    setSortBy(data.sortBy || '');
  };

  return (
    <div className="w-full min-h-[80vh]">
      <div className="wrapper overflow-x-hidden m-4 md:m-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

        <div className="w-full flex flex-col md:justify-between md:flex-row gap-4 mb-4">
          <div className="flex flex-col items-center md:justify-between md:flex-row gap-4">
            <div className="flex w-full items-end">
              <SearchBox
                onSearch={handleSearchById}
                placeholder={'Tìm kiếm theo mã...'}
              />
            </div>

            <div className="flex w-full items-end">
              <SearchBox
                onSearch={handleSearchByKey}
                placeholder={'Tìm kiếm theo tên...'}
              />
            </div>

            <div className="flex flex-row self-start justify-between gap-4">
              <FiltersModel
                onFilter={handleFilter}
                defaultValues={{
                  from: minPrice,
                  to: maxPrice,
                  sortBy: sortBy,
                  brandId: brandSelected,
                  categoryId: categorySelected,
                }}
              />

              <TooltipComponent
                childrenTrigger={
                  <div
                    onClick={handleRefresh}
                    className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 cursor-pointer transition-all duration-500 mr-2"
                  >
                    <Ban size={18} />
                  </div>
                }
                content="Loại bỏ tìm kiếm và bộ lọc"
              />
            </div>
          </div>

          <AddProductModal
            title="Thêm sản phẩm"
            childrenTrigger={
              <div className="flex items-center cursor-pointer border border-green-500 py-2 px-4 rounded-lg hover:bg-green-500 hover:text-white">
                <Plus color={'green'} size={16} className="mr-1" />
                <p>Thêm sản phẩm</p>
              </div>
            }
            handleRefresh={handleRefresh}
          />
        </div>

        {renderContent()}
      </div>
      {loading && <LoaderComponent />}
    </div>
  );
}
