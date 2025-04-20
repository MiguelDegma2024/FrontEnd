import api from ".";
import { Product } from "my-types";

// GET ALL PRODUCTS
export const getAllProducts = async () => {
  try {
    const res = await api.get(`/product`);
    // Verificar que la respuesta tenga la estructura esperada
    if (res.data && res.data.payload) {
      const products: Product[] = res.data.payload;
      return products.filter(p => p && typeof p === 'object'); // Filtrar elementos no válidos
    }
    console.error("Formato inesperado en getAllProducts:", res);
    return [];
  } catch (err) {
    console.error("Error en getAllProducts:", err);
    return [];
  }
};

// GET PRODUCT BY ID
export const getProductById = async (id: number) => {
  try {
    const res = await api.get(`/product/${id}`);
    // Verificar que la respuesta tenga la estructura esperada
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err) {
    console.error(`Error al obtener producto ${id}:`, err);
    throw err;
  }
};

// CREATE PRODUCT
export const createProduct = async (productData: Omit<Product, 'id'>) => {
  try {
    // Eliminamos cualquier propiedad undefined o null
    const cleanData = Object.fromEntries(
      Object.entries(productData).filter(([_, v]) => v !== null && v !== undefined)
    );
    
    const res = await api.post('/product', cleanData);
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err) {
    console.error("Error al crear producto:", err);
    throw err;
  }
};

// UPDATE PRODUCT
export const updateProduct = async (id: number, productData: Partial<Product>) => {
  try {
    // Eliminamos la propiedad category y cualquier propiedad undefined o null
    const { category, ...rest } = productData;
    const cleanData = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== null && v !== undefined)
    );
    
    const res = await api.put(`/product/${id}`, cleanData);
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err) {
    console.error(`Error al actualizar producto ${id}:`, err);
    throw err;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await api.delete('/product', { data: { id } }); // Enviar el ID en el cuerpo
    return true;
  } catch (err) {
    console.error(`Error al eliminar producto ${id}:`, err);
    throw err;
  }
};