import API from "./api";

// Obtener perfil
export const getUserProfile = async () => {
  const { data } = await API.get("/users/me");
  return data; 
};

// Actualizar perfil
export const updateUserProfile = async (data) => {
  try {
    const response = await API.put("/users/me", data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en updateUserProfile:", error.response?.data || error.message);
    throw error;
  }
};
