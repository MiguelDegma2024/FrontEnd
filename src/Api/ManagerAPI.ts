import api from ".";
import { Manager } from "my-types";

export const getAllManagers = async () => {
  try {
    const res = await api.get(`/manager`);
    if (res.data && res.data.payload) {
      const managers: Manager[] = res.data.payload;
      return managers.filter(m => m && typeof m === "object");
    }
    console.error("Formato inesperado en getAllManagers:", res);
    return [];
  } catch (err: any) {
    console.error("Error en getAllManagers:", err);
    return [];
  }
};