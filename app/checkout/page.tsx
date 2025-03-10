'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  CreateOrderApiRequest,
  CreateOrderApiResponse,
  PaymentFormData,
  paymentFormSchema,
  ProductOrderType,
} from '@/schemaValidation/checkout.schema';
import { CartItem, formatPrice, getLocalUser } from '@/lib/utils';
import CitySelect from '@/app/components/city-select';
import DistrictSelect from '@/app/components/district-select';
import WardSelect from '@/app/components/ward-select';
import LoaderComponent from '@/app/components/loader';
import { post } from '@/lib/http-client';
import { useAppContext } from '@/app/AppProvider';
import { UserDataType } from '@/schemaValidation/auth.schema';
import InfoModal from '@/app/components/info-modal';
import { useAddress } from '@/lib/useAddress';

const Checkout: React.FC = () => {
  const { isActioned, setIsActioned } = useAppContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  });

  const [localUser, setLocalUser] = useState<UserDataType | undefined>(
    undefined,
  );

  const [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  const {
    selectedCity,
    setSelectedCity,
    selectedDistrict,
    setSelectedDistrict,
    cityDefault,
    setCityDefault,
    districtDefault,
    setDistrictDefault,
    wardDefault,
    setWardDefault,
  } = useAddress(localUser?.city, localUser?.district);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalUser(getLocalUser());
      setCityDefault(getLocalUser()?.city || '');
      setDistrictDefault(getLocalUser()?.district || '');
      setWardDefault(getLocalUser()?.ward || '');
    }
  }, []);

  useEffect(() => {
    if (localUser) {
      setValue('name', localUser.name || '');
      setValue('email', localUser.email || '');
      setValue('customer_phone', localUser.phone || '');
      setValue('street', localUser.street || '');
      setValue('city', localUser.city || '');
      setValue('district', localUser.district || '');
      setValue('ward', localUser.ward || '');
    }
  }, [localUser, setValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      const cart: { products: CartItem[] } = JSON.parse(
        localStorage.getItem('cart') || '{ "products": [] }',
      );
      setCartItems(cart.products);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setValue]);

  const calculateSubTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const products: ProductOrderType[] = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const body: CreateOrderApiRequest = {
        ...data,
        discount: '0',
        price: calculateSubTotal(),
        products,
      };
      const result = await post<CreateOrderApiResponse>('/order/create', body);

      if (result?.id) {
        // toast({
        //   title: 'Thông báo',
        //   description:
        //     'Đặt hàng thành công, liên hệ với shop để biết thêm thông tin! ',
        //   variant: 'success',
        //   duration: 5000,
        // });

        setOrderId(result.id);
        localStorage.removeItem('cart');
        setCartItems([]);
        setIsActioned(!isActioned);
        setOpenSuccessModal(true);
        // router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full min-h-[50vh]">
      {cartItems.length === 0 ? (
        <div className="flex justify-center items-center">
          <h2 className="text-xl font-semibold mb-4">Giỏ hàng trống</h2>
        </div>
      ) : (
        <>
          <div className="bg-gray-100 py-1 px-2 flex flex-col justify-center mb-4">
            <h2 className="text-xl font-semibold">Thông tin thanh toán</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-2/3 p-4">
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1">
                      <Label className="flex flex-row" htmlFor="name">
                        Tên<p className="text-red-500 ml-1">*</p>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Họ và tên"
                        {...register('name')}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="flex flex-row" htmlFor="phoneNumber">
                        Số điện thoại<p className="text-red-500 ml-1">*</p>
                      </Label>
                      <Input
                        id="customer_phone"
                        placeholder="Số điện thoại"
                        {...register('customer_phone')}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                    {errors.customer_phone && (
                      <p className="text-red-500">
                        {errors.customer_phone.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label htmlFor="street">Email</Label>
                    <Input
                      id="email"
                      placeholder="Nhập email"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label className="flex flex-row" htmlFor="city">
                      Thành phố / Tỉnh<p className="text-red-500 ml-1">*</p>
                    </Label>
                    <CitySelect
                      onChange={(value) => {
                        setValue('city', value.name);
                        setValue('district', '');
                        setValue('ward', '');

                        setCityDefault('');
                        setDistrictDefault('');
                        setWardDefault('');

                        setSelectedDistrict('');
                        setSelectedCity(value.id);
                      }}
                      register={register}
                      name="city"
                      defaultValue={cityDefault}
                    />
                    {errors.city && (
                      <p className="text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1">
                      <Label className="flex flex-row" htmlFor="district">
                        Quận / Huyện<p className="text-red-500 ml-1">*</p>
                      </Label>
                      <DistrictSelect
                        onChange={(value) => {
                          setValue('district', value.name);
                          setSelectedDistrict(value.id);
                        }}
                        register={register}
                        name="district"
                        cityId={selectedCity}
                        defaultValue={districtDefault}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="flex flex-row" htmlFor="ward">
                        Phường / Xã<p className="text-red-500 ml-1">*</p>
                      </Label>
                      <WardSelect
                        onChange={(value) => {
                          setValue('ward', value.name);
                        }}
                        register={register}
                        name="ward"
                        districtId={selectedDistrict}
                        defaultValue={wardDefault}
                      />
                    </div>
                    {errors.district && (
                      <p className="text-red-500">{errors.district.message}</p>
                    )}
                    {errors.ward && (
                      <p className="text-red-500">{errors.ward.message}</p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label className="flex flex-row" htmlFor="street">
                      Số nhà / Đường<p className="text-red-500 ml-1">*</p>
                    </Label>
                    <Input
                      id="street"
                      placeholder="Nhập số nhà tên đường"
                      {...register('street')}
                    />
                    {errors.street && (
                      <p className="text-red-500">{errors.street.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-gray-100 mt-4 p-8 border-t md:mt-0 md:border-t-0 shadow-2xl">
                <h2 className="text-2xl font-bold mb-8">Tộng cộng</h2>

                {cartItems.map((item) => (
                  <div className="flex justify-between" key={item.product_id}>
                    <span className="font-light">
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                ))}

                <div className="flex justify-between">
                  <span className="font-bold">Tiền tạm tính</span>
                  <span className="font-bold">
                    {formatPrice(calculateSubTotal())}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-bold">Vận chuyển</span>
                  <span className="font-bold">Chưa bao gồm</span>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="font-bold">Tổng cộng</span>
                  <span className="text-xl font-bold">
                    {formatPrice(calculateSubTotal())}
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`${loading ? 'opacity-50' : ''}w-full mt-8 bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded`}
                >
                  Đặt hàng
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
      {loading && <LoaderComponent />}
      <InfoModal
        open={openSuccessModal}
        setOpen={setOpenSuccessModal}
        id={orderId}
      />
    </div>
  );
};

export default Checkout;
