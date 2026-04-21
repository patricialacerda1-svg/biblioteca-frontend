import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Inicialização (ao carregar a aplicação)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // 🔐 valida expiração do token
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔑 Login
  const loginUser = (token) => {
    if (!token) {
      console.error("Token não fornecido no login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);
      setUser(decoded);
    } catch (err) {
      console.error("Erro ao decodificar token no login:", err);
    }
  };

  // 🚪 Logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🛡️ Helpers (facilitam MUITO no projeto)
  const isAuthenticated = !!user;
  const isAdmin = user?.perfil === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
