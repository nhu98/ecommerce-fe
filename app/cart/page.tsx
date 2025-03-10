'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem, formatPrice, updateLocalStorage } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/app/AppProvider';
import { useRouter } from 'next/navigation';

const baseUrl = 'https://qlbh-be.onrender.com';

const Cart: React.FC = () => {
  const router = useRouter();
  const { isActioned, setIsActioned } = useAppContext();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedCartItems = cartItems.map((item) =>
      item.product_id === id ? { ...item, quantity: quantity } : item,
    );
    setCartItems(updatedCartItems);
    updateLocalStorage(updatedCartItems);
    setIsActioned(!isActioned);
  };

  const handleRemove = (id: string) => {
    const updatedCartItems = cartItems.filter((item) => item.product_id !== id);
    setCartItems(updatedCartItems);
    updateLocalStorage(updatedCartItems);
    toast({
      title: 'Thành công!',
      description: `Bỏ sản phẩm ra giỏ hàng: ${id}`,
      duration: 3000,
      variant: 'success',
    });
    setIsActioned(!isActioned);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push(`/checkout?total=${calculateTotal()}`);
  };

  return (
    <div className="p-4 w-full min-h-[50vh]">
      <div className="bg-gray-100 py-1 px-2 flex flex-col justify-center mb-4">
        <h2 className="text-xl font-semibold">Giỏ hàng</h2>
      </div>
      {cartItems.length === 0 ? (
        <p>Không có sản phẩm trong giỏ hàng!</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-2/3 md:p-8">
            {cartItems.map((item) => (
              <div
                key={item.product_id}
                className="w-full flex justify-between items-center mb-4 md:p-2 border-b"
              >
                <div className="md:w-1/3">
                  <Image
                    src={
                      item.image
                        ? `${baseUrl}/imgs/products/${item.image}`
                        : '/images/no-image.webp'
                    }
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                </div>

                <div className="md:w-1/3 ml-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className=" block md:hidden text-gray-500">
                    Đơn giá: {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center mt-2">
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity - 1)
                      }
                      className="px-1 py-0.5 rounded-md border"
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity + 1)
                      }
                      className="px-1 py-0.5 rounded-md border"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/3">
                  <p className="text-gray-500">
                    Đơn giá: {formatPrice(item.price)}
                  </p>
                  <p className="text-gray-500">
                    Thành tiền: {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="">
                  <Button
                    onClick={() => handleRemove(item.product_id)}
                    className="ml-auto text-gray-500 hover:text-red-500"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/3 bg-gray-100 mt-4 p-8 border-t md:mt-0 md:border-t-0 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8">Tộng cộng</h2>
            <div className="flex justify-between">
              <span className="font-medium">Tổng giá:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-medium">Vận chuyển:</span>
              <span>Chưa bao gồm</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="font-medium">Tổng cộng:</span>
              <span className="text-xl font-bold">
                {formatPrice(calculateTotal())}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={calculateTotal() === 0}
              className={` ${calculateTotal() === 0 ? 'opacity-50' : ''} w-full mt-8 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded`}
            >
              Đặt hàng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
