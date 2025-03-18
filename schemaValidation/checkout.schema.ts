import * as z from 'zod';

export const paymentFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
    .max(100, { message: 'Tên không được vượt quá 100 ký tự' })
    .refine((value) => /^[\p{L}\s]+$/u.test(value), {
      message: 'Tên chỉ được chứa chữ cái, dấu tiếng Việt và khoảng trắng',
    }),
  customer_phone: z
    .string()
    .min(5, {
      message: 'Số điện thoại không hợp lệ',
    })
    .max(11, { message: 'Số điện thoại không vượt quá 11 số' }), // city: z.string().min(1, { message: 'Chưa chọn Thành phố / Tỉnh' }),
  // district: z.string().min(1, { message: 'Chưa chọn Quận / Huyện' }),
  // ward: z.string().min(1, { message: 'Chưa chọn Phường / Xã' }),
  // street: z
  //   .string()
  //   .min(2, { message: 'Số nhà / Đường phải có ít nhất 2 ký tự' })
  //   .max(200, { message: 'Số nhà / Đường không được vượt quá 200 ký tự' }),
  street: z
    .string()
    .min(2, { message: 'Bắt buộc nhập địa chỉ' })
    .max(300, { message: 'Địa chỉ không được vượt quá 300 ký tự' }),
  email: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

export interface CreateOrderApiResponse {
  id: string;
  customer_phone: string;
  staff_phone: string;
  date: string;
  delivery_date: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  discount: number;
  price: number;
  status: string;
  payment_status: number;
}

export interface ProductOrderType {
  product_id: string;
  quantity: number;
}

export interface CreateOrderApiRequest {
  name: string;
  email?: string;
  customer_phone: string;
  // city: string;
  // district: string;
  // ward: string;
  street: string;
  discount: string;
  price: number;
  products: ProductOrderType[];
}
