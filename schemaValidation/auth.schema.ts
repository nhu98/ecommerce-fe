import * as z from 'zod';

export const signInSchema = z.object({
  username: z
    .string()
    .min(5, {
      message: 'Nhập đúng định dạng số điện thoại ',
    })
    .max(11, { message: 'Số điện thoại không vượt quá 11 số' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  phone: z
    .string()
    .min(5, {
      message: 'Số điện thoại không hợp lệ',
    })
    .max(11, { message: 'Số điện thoại không vượt quá 11 số' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  name: z
    .string()
    .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
    .max(100, { message: 'Tên không được vượt quá 100 ký tự' })
    .refine((value) => /^[\p{L}\s]+$/u.test(value), {
      message: 'Tên chỉ được chứa chữ cái, dấu tiếng Việt và khoảng trắng',
    }), // email: z
  //   .string()
  //   .email({ message: 'Email không hợp lệ' })
  //   .min(5, { message: 'Email phải có ít nhất 5 ký tự' })
  //   .max(255, { message: 'Email không được vượt quá 255 ký tự' }),
  email: z.string().optional(),
  city: z.string().min(1, { message: 'Chưa chọn Thành phố / Tỉnh' }),
  district: z.string().min(1, { message: 'Chưa chọn Quận / Huyện' }),
  ward: z.string().min(1, { message: 'Chưa chọn Phường / Xã' }),
  street: z
    .string()
    .min(2, { message: 'Số nhà / Đường phải có ít nhất 2 ký tự' })
    .max(200, { message: 'Số nhà / Đường không được vượt quá 200 ký tự' }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const LoginResSchema = z.object({
  token: z.string(),
});

export type LoginRes = z.infer<typeof LoginResSchema>;

export const UserResSchema = z.object({
  phone: z.string(),
  role_id: z.number(),
  name: z.string(),
  city: z.string(),
  district: z.string(),
  ward: z.string(),
  street: z.string(),
  email: z.string(),
});

export type SignUpRes = z.infer<typeof LoginResSchema>;

export type UserDataType = z.infer<typeof UserResSchema>;

export interface UserApiResponse {
  users: UserDataType[];
  totalPages: number;
}

export interface DeleteUserApiResponse {
  message: string;
}

export interface ProductOrderType {
  product_id: string;
  product_name: string;
  quantity: number;
}

export interface OrderResponse {
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
  products?: ProductOrderType[];
  ship_price: number;
}

export interface OrderApiResponse {
  orders: OrderResponse[];
  totalPages: number;
}

export interface DeleteOrderApiResponse {
  message: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  show: number;
}

export interface CategoriesApiResponse {
  categories: CategoryResponse[];
  totalPages: number;
}

export interface DeleteCategoryApiResponse {
  message: string;
}

export const addCategorySchema = z.object({
  name: z.string().min(1, {
    message: 'Nhập tên cho danh mục!',
  }),
});

export type AddCategoryFormData = z.infer<typeof addCategorySchema>;

export interface UpdateCategoryApiResponse {
  message: string;
  result: CategoryResponse;
}

export interface BrandResponse {
  id: string;
  name: string;
  show: number;
}

export interface BrandsApiResponse {
  brands: BrandResponse[];
  totalPages: number;
}

export interface DeleteBrandApiResponse {
  message: string;
}

export const addBrandSchema = z.object({
  name: z.string().min(1, {
    message: 'Nhập tên cho thương hiệu!',
  }),
});

export type AddBrandFormData = z.infer<typeof addBrandSchema>;

export interface UpdateBrandApiResponse {
  message: string;
  result: BrandResponse;
}

export interface ProductResponse {
  id: string;
  name: string;
  brand_id: string;
  category_id: string;
  detail: string;
  price: number;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  show: number;
  category_name: string;
  brand_name: string;
  similar_products?: ProductResponse[];
}

export interface ProductsApiResponse {
  products: ProductResponse[];
  totalPages: number;
}

export interface DeleteProductApiResponse {
  message: string;
}

export const addProductSchema = z.object({
  name: z.string().min(1, {
    message: 'Nhập tên cho sản phẩm!',
  }),
  brand_id: z.string().min(1, {
    message: 'Chọn thương hiệu cho sản phẩm!',
  }),
  category_id: z.string().min(1, {
    message: 'Chọn danh mục cho sản phẩm!',
  }),
  price: z
    .string()
    .transform((val) => Number(val.replace(/\./g, '')))
    .refine((val) => val >= 0 && val <= 1000000000, {
      message: 'Giá đến phải lớn hơn hoặc bằng 0 và nhỏ hơn 1 tỉ',
    })
    .transform((val) => val.toString()),
  detail: z.string().min(1, {
    message: 'Nhập chi tiết cho sản phẩm!',
  }),
  img1: z.string().optional(),
  img2: z.string().optional(),
  img3: z.string().optional(),
  img4: z.string().optional(),
  img5: z.string().optional(),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;

export type UpdateProductFormData = z.infer<typeof addProductSchema>;

export interface UpdateProductApiRequest {
  id: string;
  name: string;
  brand_id: string;
  category_id: string;
  price: number;
  detail: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
}

export interface UpdateProductApiResponse {
  message: string;
  result: ProductResponse;
}

export const filterSchema = z.object({
  from: z
    .string()
    .transform((val) => Number(val.replace(/\./g, '')))
    .refine((val) => val >= 0 && val <= 1000000000, {
      message: 'Giá từ phải lớn hơn hoặc bằng 0 và nhỏ hơn 1 tỉ',
    })
    .transform((val) => val.toString())
    .optional(),
  to: z
    .string()
    .transform((val) => Number(val.replace(/\./g, '')))
    .refine((val) => val >= 0 && val <= 1000000000, {
      message: 'Giá đến phải lớn hơn hoặc bằng 0 và nhỏ hơn 1 tỉ',
    })
    .transform((val) => val.toString())
    .optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  sortBy: z.string().optional(),
});

export type FilterFormData = z.infer<typeof filterSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.string().min(1, {
    message: 'Hãy chọn trạng thái đơn hàng',
  }),
  payment_status: z
    .string()
    .min(1, { message: 'Hãy chọn trạng thái thanh toán' }),
  ship_price: z
    .string()
    .transform((val) => Number(val.replace(/\./g, '')))
    .refine((val) => val >= 0 && val <= 1000000000, {
      message: 'Giá đến phải lớn hơn hoặc bằng 0 và nhỏ hơn 1 tỉ',
    })
    .transform((val) => val.toString()),
});

export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;

export interface UpdateOrderResponse {
  message: string;
  result: OrderResponse;
}

export interface ChangPasswordRes {
  phone: string;
  password: string;
  role_id: number;
  name: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  email: string;
  show: number;
}

export const changePasswordSchema = z.object({
  old_password: z
    .string()
    .min(6, { message: 'Mật khẩu cũ phải có ít nhất 6 ký tự' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export interface ChangePasswordResponse {
  message: string;
  result: ChangPasswordRes;
}

export interface ShopDataApiResponse {
  name: string;
  sologan: string;
  intro: string;
  question: string;
  contact: string;
  logo: string;
  banner: string;
}

export const updateShopSchema = z.object({
  name: z.string().min(1, { message: 'Tên shop phải có ít nhất 1 ký tự' }),
  sologan: z.string().min(1, { message: 'Slogan phải có ít nhất 1 ký tự' }),
});

export type UpdateShopFormData = z.infer<typeof updateShopSchema>;

export interface UpdateShopResponse {
  message: string;
  result: ShopDataApiResponse;
}

export const updateContentSchema = z.object({
  intro: z.string().min(1, { message: 'Intro phải có ít nhất 1 ký tự' }),
  question: z.string().min(1, { message: 'Question phải có ít nhất 1 ký tự' }),
  contact: z.string().min(1, { message: 'Contact phải có ít nhất 1 ký tự' }),
});

export type UpdateContentFormData = z.infer<typeof updateContentSchema>;

export interface UpdateContentResponse {
  message: string;
  result: ShopDataApiResponse;
}

export const updateUserSchema = z.object({
  phone: z
    .string()
    .min(5, {
      message: 'Số điện thoại không hợp lệ',
    })
    .max(11, { message: 'Số điện thoại không vượt quá 11 số' }),
  name: z
    .string()
    .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
    .max(100, { message: 'Tên không được vượt quá 100 ký tự' })
    .refine((value) => /^[\p{L}\s]+$/u.test(value), {
      message: 'Tên chỉ được chứa chữ cái, dấu tiếng Việt và khoảng trắng',
    }),
  email: z.string().optional(),
  city: z.string().min(1, { message: 'Chưa chọn Thành phố / Tỉnh' }),
  district: z.string().min(1, { message: 'Chưa chọn Quận / Huyện' }),
  ward: z.string().min(1, { message: 'Chưa chọn Phường / Xã' }),
  street: z
    .string()
    .min(2, { message: 'Số nhà / Đường phải có ít nhất 2 ký tự' })
    .max(200, { message: 'Số nhà / Đường không được vượt quá 200 ký tự' }),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export interface UpdateUserResponse {
  message: string;
  result: ChangPasswordRes;
}
