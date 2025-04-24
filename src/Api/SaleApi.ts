import axios from 'axios';
import { Sale, SaleSummary } from 'my-types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SALES_ENDPOINT = `${BASE_URL}/sales`;

// Interface for API responses
interface ApiResponse<T> {
  status: string;
  message: string;
  payload: T;
}

export const getAllSales = async (): Promise<Sale[]> => {
  try {
    const response = await axios.get<ApiResponse<Sale[]>>(SALES_ENDPOINT);
    if (response.data && response.data.payload) {
      return response.data.payload;
    } else {
      console.error("Formato de respuesta inesperado:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return [];
  }
};

export const getSalesByUser = async (userId: number): Promise<Sale[]> => {
  try {
    const response = await axios.get<ApiResponse<Sale[]>>(`${SALES_ENDPOINT}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.payload || [];
  } catch (error) {
    console.error("Error al obtener las ventas del usuario:", error);
    return [];
  }
};

export const createSale = async (saleData: Partial<Sale>): Promise<Sale | null> => {
  try {
    const response = await axios.post<ApiResponse<Sale>>(SALES_ENDPOINT, saleData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return null;
  }
};

export const getSalesSummary = async (): Promise<SaleSummary[]> => {
  try {
    const response = await axios.get<ApiResponse<SaleSummary[]>>(`${SALES_ENDPOINT}/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.payload || [];
  } catch (error) {
    console.error("Error al obtener el resumen de ventas:", error);
    return [];
  }
};