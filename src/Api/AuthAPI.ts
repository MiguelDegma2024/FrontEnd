// src/Api/AuthAPI.ts
import axios from 'axios';
import { User } from 'my-types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al iniciar sesión');
    }
    throw new Error('Error de conexión al servidor');
  }
};

export const register = async (
  name: string, 
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    // Por defecto asignamos el rol de usuario
    const userData = {
      name,
      email,
      password,
      role: 'user'
    };
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al registrar usuario');
    }
    throw new Error('Error de conexión al servidor');
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Interceptor para incluir el token en todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);