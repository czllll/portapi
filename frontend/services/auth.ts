interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  code: number;
  success: boolean;
  message: string;
  data?: {
    userId: string;
  }
}

interface LoginData {
  email: string;
  password: string;
}

interface BaseResponse<T> {
  code: number;
  data: T;
  message: string;
}

type LoginResponse = BaseResponse<{
  userId: number;
  username: string;
  email: string;
  token: string;
  avatar: string | null;
  role: string;
}>;

import axios from 'axios';
import Cookies from 'js-cookie';
import router from 'next/router';
import toast from 'react-hot-toast';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const TOKEN_KEY = 'access_token';


axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      toast.error('登录已过期，请重新登录');
      throw new Error('登录已过期，请重新登录');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (formData: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await axios.post<RegisterResponse>(
        `${BASE_API_URL}/user/register`, 
        formData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '注册失败');
      }
      throw error;
    }
  },

  login: async (formData: LoginData): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_API_URL}/user/login`, 
        formData
      );
      if (response.data.code !== 200) {
        toast.error(response.data.message);
      }     
      if (response.data.data?.token) {
        const token = response.data.data.token;        
        Cookies.set(TOKEN_KEY, token);
        localStorage.setItem('token', token);
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }


      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '登录失败');
      }
      throw error;
    }
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/current`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || '获取用户信息失败');
        throw new Error(error.response?.data?.message || '获取用户信息失败');
      }
      throw error;
    }
  }
};