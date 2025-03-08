import envConfig from '@/config';
import { toast } from '@/components/ui/use-toast';
import { logout } from '@/lib/utils';

const baseUrl = envConfig.NEXT_PUBLIC_URL;

export const isClient = () => typeof window !== 'undefined';

async function request<T>(
  method: string,
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const headers = new Headers(options?.headers);

    if (isClient()) {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken}`);
      }
    }

    const response = await fetch(`${baseUrl}${url}`, {
      method,
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Something went wrong! Error Status: ${response.status}`;
      try {
        const errorText = await response.clone().text();

        switch (response.status) {
          case 400:
            if (errorText === 'old_password incorrect') {
              errorMessage = 'Mật khẩu hiện tại không đúng!';
            } else if (errorText === 'jwt expired') {
              await logout();
              window.location.reload();
            } else {
              errorMessage = `Bad Request: ${errorText}`;
            }
            break;
          case 401:
            localStorage.removeItem('sessionToken');
            errorMessage = 'You are not authorized to access this resource.';
            break;
          case 403:
            errorMessage =
              'You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 500:
            if (errorText) {
              errorMessage = `Internal Server Error: ${errorText}`;
            } else {
              errorMessage =
                'Internal Server Error. Please check the console for details.';
            }
            break;
        }
      } catch (error) {
        console.log(error);
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 3000,
      });
      return {} as T;
    } else {
      return (await response.json()) as T;
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong! Please try again later.',
      variant: 'destructive',
      duration: 3000,
    });
    throw error;
  }
}

export async function get<T>(
  url: string,
  params?: Record<string, string>,
): Promise<T> {
  const queryString = params ? new URLSearchParams(params).toString() : '';
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request<T>('GET', fullUrl);
}

export async function post<T>(url: string, data: object): Promise<T> {
  return request<T>('POST', url, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function put<T>(url: string, data: object): Promise<T> {
  return request<T>('PUT', url, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function del<T>(url: string): Promise<T> {
  return request<T>('DELETE', url);
}

export async function postWithFormData<T>(
  url: string,
  formData: FormData,
): Promise<T> {
  return requestWithFormData<T>(url, 'POST', formData);
}

export async function putWithFormData<T>(
  url: string,
  formData: FormData,
): Promise<T> {
  return requestWithFormData<T>(url, 'PUT', formData);
}

async function requestWithFormData<T>(
  url: string,
  method: string,
  formData: FormData,
): Promise<T> {
  try {
    const headers = new Headers();

    if (isClient()) {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken}`);
      }
    }

    const response = await fetch(`${baseUrl}${url}`, {
      method: method,
      body: formData,
      headers: headers,
    });

    if (!response.ok) {
      let errorMessage = `Something went wrong! Error Status: ${response.status}`;
      try {
        const errorText = await response.clone().text();

        console.log('Error Text:', errorText);

        switch (response.status) {
          case 400:
            if (errorText === 'jwt expired') {
              await logout();
              window.location.reload();
            }

            errorMessage = `Bad Request: ${errorText}`;
            break;
          case 401:
            localStorage.removeItem('sessionToken');
            errorMessage = 'You are not authorized to access this resource.';
            break;
          case 403:
            errorMessage =
              'You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 500:
            if (errorText) {
              errorMessage = `Internal Server Error: ${errorText}`;
            } else {
              errorMessage =
                'Internal Server Error. Please check the console for details.';
            }
            break;
        }
      } catch (error) {
        console.log(error);
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 3000,
      });
      return {} as T;
    } else {
      return (await response.json()) as T;
    }
  } catch (error) {
    console.error('Fetch Error:', error);

    toast({
      title: 'Error',
      description: 'Something went wrong! Please try again later.',
      variant: 'destructive',
      duration: 3000,
    });

    throw error;
  }
}
