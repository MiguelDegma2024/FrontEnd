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
  } catch (err: any) { // Type the error as 'any' to allow property access
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
  } catch (err: any) { // Type the error as 'any' to allow property access
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
  } catch (err: any) { // Type the error as 'any' to allow property access
    console.error("Error al crear producto:", err);
    throw err;
  }
};

export const updateProduct = async (id: number, productData: Partial<Product>) => {
  try {
    // Eliminamos la propiedad category y cualquier propiedad undefined o null
    const { category, ...rest } = productData;
    const cleanData = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== null && v !== undefined)
    );
    
    console.log(`Updating product ${id} with data:`, cleanData);
    
    const res = await api.patch(`/product/${id}`, cleanData);
    console.log("Update response:", res.data);
    
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err: any) { // Type the error as 'any' to allow property access
    // More detailed error logging
    if (err.response) {
      console.error(`Error al actualizar producto ${id}:`, {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        url: err.response.config?.url
      });
    } else {
      console.error(`Error al actualizar producto ${id}:`, err.message || err);
    }
    throw err;
  }
};

//DELETE PRODUCT
export const deleteProduct = async (id: number) => {
  try {
    await api.delete('/product', { data: { id } }); // Enviar el ID en el cuerpo
    return true;
  } catch (err: any) { // Type the error as 'any' to allow property access
    console.error(`Error al eliminar producto ${id}:`, err);
    throw err;
  }
};