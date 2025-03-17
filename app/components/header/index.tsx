'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  BookMarked,
  Contact,
  House,
  Inbox,
  KeyRound,
  Menu,
  MessageCircleQuestion,
  Search,
  ShoppingCart,
  User,
  UserRoundCog,
  X,
} from 'lucide-react';
import { NavLink } from '../nav-link';
import Link from 'next/link';
import FiltersModel from '@/app/components/filters-modal';
import AuthModal from '@/app/components/auth-modal';
import { SheetComponent } from '@/app/components/sheet-component';
import { Button } from '@/components/ui/button';
import { CartItem, getLocalUser, isValue, logout } from '@/lib/utils';
import {
  FilterFormData,
  ShopDataApiResponse,
  UserDataType,
} from '@/schemaValidation/auth.schema';
import { usePathname, useRouter } from 'next/navigation';
import SearchBox from '@/app/admin/accounts/components/search-box';
import { useAppContext } from '@/app/AppProvider';
import { NoAvatar } from '@/app/components/user-avatar/no-image-avt';
import ChangePasswordModal from '@/app/components/change-password-modal';
import { get } from '@/lib/http-client';
import { useCategoryData } from '@/lib/categoryData';

const navLinks: NavLink[] = [
  {
    href: '/',
    label: 'Trang chủ',
    icon: House,
  },
  {
    href: '/us-information?tab=intro',
    label: 'Giới thiệu',
    icon: BookMarked,
  },
  {
    href: '/us-information?tab=question',
    label: 'Câu hỏi',
    icon: MessageCircleQuestion,
  },
  {
    href: '/us-information?tab=contact',
    label: 'Liên hệ',
    icon: Contact,
  },
];

// const adminNavLinks: NavLink[] = [
//   {
//     href: '/',
//     label: 'Trang chủ',
//   },
// ];

const baseUrl = 'http://14.225.206.204:3001';

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { isActioned, token, login } = useAppContext();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [openSheet, setOpenSheet] = useState(false);
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const [localUser, setLocalUser] = useState<UserDataType | undefined>(
    undefined,
  );

  const [categorySelected, setCategorySelected] = useState('');
  const [brandSelected, setBrandSelected] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [numberOfCartItems, setNumberOfCartItems] = useState<number>(0);

  const [shopData, setShopData] = useState<ShopDataApiResponse>();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const result = await get<ShopDataApiResponse>('/shop/get');

        if (isValue(result)) {
          setShopData(result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchShopData().then();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const cart: { products: CartItem[] } = JSON.parse(
        localStorage.getItem('cart') || '{ "products": [] }',
      );

      const toTalProductsInCart = cart.products.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      setNumberOfCartItems(toTalProductsInCart);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isActioned]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        setLocalUser(getLocalUser());
      } else if (!token) {
        setLocalUser(undefined);
      }
    }
  }, [token]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        isSearchVisible
      ) {
        setIsSearchVisible(false);
      }
    },
    [isSearchVisible],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchByKey = (value: string) => {
    setSearchValue(value);
    router.push(
      `/search-products?search=${value}&category=${categorySelected}&brand=${brandSelected}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}`,
    );
  };

  const handleFilter = (data: FilterFormData) => {
    setCategorySelected(data.categoryId || '');
    setBrandSelected(data.brandId || '');
    setSortBy(data.sortBy || '');
    setMinPrice(data.from || '');
    setMaxPrice(data.to || '');
    router.push(
      `/search-products?search=${searchValue}&category=${data.categoryId}&brand=${data.brandId}&minPrice=${data.from}&maxPrice=${data.to}&sortBy=${data.sortBy}`,
    );
  };

  const { categories, totalPages, handleLoadMoreCategories } =
    useCategoryData();

  const renderSheetContent = () => {
    if (localUser?.role_id === 1) {
      return (
        <div className="flex flex-col gap-2">
          <Link href={'/admin'} onClick={() => setOpenSheet(false)}>
            <div className="flex flex-row  items-center gap-4 hover:opacity-50">
              <UserRoundCog size={16} />
              <p>Trang quản lý</p>
            </div>
          </Link>

          <div
            onClick={() => setOpenChangePassword(true)}
            className="flex flex-row  items-center gap-4 hover:opacity-50 cursor-pointer"
          >
            <KeyRound size={16} />
            <p>Đổi mật khẩu</p>
          </div>
        </div>
      );
    } else if (localUser?.role_id === 3) {
      return (
        <div className="flex flex-col gap-2">
          <Link href={`/order-management`} onClick={() => setOpenSheet(false)}>
            <div className="flex flex-row  items-center gap-4 hover:opacity-50">
              <Inbox size={16} />
              <p>Quản lý đơn hàng</p>
            </div>
          </Link>

          <Link
            href={`/account-management`}
            onClick={() => setOpenSheet(false)}
          >
            <div className="flex flex-row  items-center gap-4 hover:opacity-50">
              <User size={16} />
              <p>Thông tin tài khoản</p>
            </div>
          </Link>

          <div
            onClick={() => setOpenChangePassword(true)}
            className="flex flex-row  items-center gap-4 hover:opacity-50 cursor-pointer"
          >
            <KeyRound size={16} />
            <p>Đổi mật khẩu</p>
          </div>
        </div>
      );
    }
  };

  const renderMenuSheetContent = () => {
    return (
      <div className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setOpenMenuSheet(false)}
          >
            <div className="flex flex-row  items-center gap-4 hover:text-red-500 hover:opacity-50 pb-1">
              <link.icon size={16} />
              <p className="font-semibold">{link.label}</p>
            </div>
          </Link>
        ))}

        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}&category=${category.name}`}
            onClick={() => setOpenMenuSheet(false)}
          >
            <div className="flex flex-row  items-center gap-4 hover:text-red-500 hover:opacity-50 pb-1">
              <p className="">{category.name}</p>
            </div>
          </Link>
        ))}

        {totalPages > 1 && (
          <Button
            onClick={handleLoadMoreCategories}
            className="w-full mt-2 hover:bg-gray-100"
          >
            Xem thêm
          </Button>
        )}
      </div>
    );
  };

  return (
    <header className="relative">
      {/*<div>*/}
      {/*  <div className="flex px-5">*/}
      {/*    <div className="flex justify-center md:justify-normal w-full bg-[#f5f6f2] rounded-b-3xl px-2">*/}
      {/*      <div className="p-2">*/}
      {/*        <NavLinks*/}
      {/*          links={pathname.startsWith('/admin') ? adminNavLinks : navLinks}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div
        className={`mx-auto flex px-4 md:px-8 justify-between items-center font-inter top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSticky
            ? 'py-1 md:py-2 fixed bg-rgba(255, 255, 255, 0.9) backdrop-blur-sm shadow-md' // Sticky styles
            : 'py-2 md:py-4 bg-white' // Normal styles
        }`}
      >
        {pathname.startsWith('/admin') ? null : (
          <div>
            <SheetComponent
              open={openMenuSheet}
              onOpenChange={setOpenMenuSheet}
              childTrigger={
                <div
                  className={
                    'w-11 h-11 rounded bg-gray-100 flex items-center justify-center hover:bg-red-500 cursor-pointer transition-all duration-500'
                  }
                >
                  <Menu />
                </div>
              }
              side={'left'}
            >
              <div className="flex flex-col justify-center gap-4">
                {renderMenuSheetContent()}
              </div>
            </SheetComponent>
          </div>
        )}

        {/* Logo Section */}
        <div className="flex items-center">
          <Link href={'/'}>
            <Image
              priority
              src={
                shopData?.logo
                  ? `${baseUrl}/imgs/shop/${shopData?.logo}`
                  : '/images/no-image.webp'
              }
              width={80}
              height={80}
              className="cursor-pointer"
              alt={'logo'}
            />
          </Link>
        </div>

        {pathname.startsWith('/admin') ? null : (
          <div className=" w-2/3 hidden md:flex">
            <div className="flex flex-row w-full items-center">
              <SearchBox
                onSearch={handleSearchByKey}
                placeholder={'Tìm kiếm sản phẩm...'}
              />
            </div>
          </div>
        )}

        <div className="flex">
          {pathname.startsWith('/admin') ? null : (
            <div className="flex flex-row mr-2">
              <div
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center md:hidden hover:bg-red-500 cursor-pointer transition-all duration-500 mr-2"
                onClick={toggleSearch}
              >
                <Search size={18} />
              </div>

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
            </div>
          )}

          {localUser?.phone ? (
            <div className="flex items-center cursor-pointer mr-2">
              <SheetComponent
                open={openSheet}
                onOpenChange={setOpenSheet}
                childTrigger={<NoAvatar isClickable />}
              >
                <div className="flex flex-col justify-center gap-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex justify-center items-center">
                      <NoAvatar />
                    </div>

                    <div className="flex flex-col">
                      <p className="font-semibold">{localUser.name}</p>
                      <p className="text-sm text-gray-500">{localUser.phone}</p>
                    </div>
                  </div>

                  {renderSheetContent()}

                  <Button
                    onClick={async () => {
                      await logout();

                      setOpenSheet(false);
                      login('');
                      router.push('/');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Đăng xuất
                  </Button>
                </div>
              </SheetComponent>
            </div>
          ) : (
            <AuthModal />
          )}

          {pathname.startsWith('/admin') ? null : (
            <Link href={'/cart'}>
              <div className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                <ShoppingCart size={18} />
                {numberOfCartItems > 0 && (
                  <div className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {numberOfCartItems}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white p-4 z-50 shadow-md transition-transform duration-500 ease-in-out ${isSearchVisible ? 'translate-y-0' : '-translate-y-full'}`}
        ref={searchInputRef}
      >
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by keyword or #"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={toggleSearch}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isCustomer={localUser?.role_id === 3}
        open={openChangePassword}
        setOpen={setOpenChangePassword}
        phoneNumber={localUser?.phone || ''}
      />
    </header>
  );
}

export default Header;
