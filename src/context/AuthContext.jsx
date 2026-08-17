/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  login as loginAdmin,
  logout as logoutAdmin,
} from "@/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await loginAdmin(email, password);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
