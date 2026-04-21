import api from "./api";

export const login = async (email, senha) => {
  try {
    console.log("Attempting login with:", { email, senha });
    const response = await api.post("/login", { email, senha });
    console.log("Login API response:", response.data);
    return response;
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const response = await api.get("/validate-token");
    console.log("Token validation successful:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Token validation failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
