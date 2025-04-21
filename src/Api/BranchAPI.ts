import api from ".";
import { Branch } from "my-types";

// GET ALL BRANCHES
export const getAllBranches = async () => {
  try {
    const res = await api.get(`/branch`);
    if (res.data && res.data.payload) {
      const branches: Branch[] = res.data.payload;
      return branches.filter(b => b && typeof b === "object");
    }
    console.error("Formato inesperado en getAllBranches:", res);
    return [];
  } catch (err: any) {
    console.error("Error en getAllBranches:", err);
    return [];
  }
};

// GET BRANCH BY ID
export const getBranchById = async (id: number) => {
  try {
    const res = await api.get(`/branch/${id}`);
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err: any) {
    console.error(`Error al obtener branch ${id}:`, err);
    throw err;
  }
};

// CREATE BRANCH
export const createBranch = async (branchData: Omit<Branch, "id">) => {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(branchData).filter(([_, v]) => v !== null && v !== undefined)
    );

    const res = await api.post("/branch", cleanData);
    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err: any) {
    console.error("Error al crear branch:", err);
    throw err;
  }
};

// UPDATE BRANCH
export const updateBranch = async (id: number, branchData: Partial<Branch>) => {
  try {
    // Eliminamos la propiedad manager y cualquier propiedad undefined o null
    const { manager, ...rest } = branchData;
    const cleanData = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== null && v !== undefined)
    );

    console.log(`Updating branch ${id} with data:`, cleanData);

    const res = await api.patch(`/branch/${id}`, cleanData);
    console.log("Update response:", res.data);

    if (res.data && res.data.payload) {
      return res.data.payload;
    }
    throw new Error("Formato de respuesta inesperado");
  } catch (err: any) {
    if (err.response) {
      console.error(`Error al actualizar branch ${id}:`, {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        url: err.response.config?.url,
      });
    } else {
      console.error(`Error al actualizar branch ${id}:`, err.message || err);
    }
    throw err;
  }
};

// DELETE BRANCH
export const deleteBranch = async (id: number) => {
  try {
    await api.delete("/branch", { data: { id } });
    return true;
  } catch (err: any) {
    console.error(`Error al eliminar branch ${id}:`, err);
    throw err;
  }
};