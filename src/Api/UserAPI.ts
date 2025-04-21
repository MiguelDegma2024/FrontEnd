import api from ".";
import { User } from "my-types";

// GET ALL USERS
export const getAllUsers = async () => {
  try {
    const res = await api.get(`/user`);
    if (res.data && res.data.payload) {
      const users: User[] = res.data.payload;
      return users.filter(u => u && typeof u === 'object');
    }
    console.error("Formato inesperado en getAllUsers:", res);
    return [];
  } catch (err: any) {
    console.error("Error en getAllUsers:", err);
    return [];
  }
};

// GET USER BY ID
export const getUserById = async (id: number) => {
  try {
    const res = await api.get(`/user/${id}`);
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err: any) {
    console.error(`Error al obtener usuario ${id}:`, err);
    throw err;
  }
};

// CREATE USER
export const createUser = async (userData: Omit<User, 'id'>) => {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== null && v !== undefined)
    );

    const res = await api.post('/user', cleanData);
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err: any) {
    console.error("Error al crear usuario:", err);
    throw err;
  }
};

// UPDATE USER
export const updateUser = async (id: number, userData: Partial<User>) => {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== null && v !== undefined)
    );

    const res = await api.patch(`/user/${id}`, cleanData);
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err: any) {
    if (err.response) {
      console.error(`Error al actualizar usuario ${id}:`, {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        url: err.response.config?.url
      });
    } else {
      console.error(`Error al actualizar usuario ${id}:`, err.message || err);
    }
    throw err;
  }
};

// DELETE USER
export const deleteUser = async (id: number) => {
  try {
    await api.delete('/user', { data: { id } });
    return true;
  } catch (err: any) {
    console.error(`Error al eliminar usuario ${id}:`, err);
    throw err;
  }
};
