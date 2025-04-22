
import api from ".";
import { Category } from "my-types";

export const getAllCategories = async () => {
  try {
    const res = await api.get(`/category`);
    if (res.data && res.data.payload) {
      const categories: Category[] = res.data.payload;
      return categories.filter(c => c && typeof c === "object");
    }
    console.error("Formato inesperado en getAllCategories:", res);
    return [];
  } catch (err: any) {
    console.error("Error en getAllCategories:", err);
    return [];
  }
};