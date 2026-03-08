import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { loginUser } from "../api/authenticationApi";
import { api } from "../api/config";

export interface User {
  id: number;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  authenticated: boolean;
}

interface LoginResponse {
  success: boolean;
  data: User;
  token: string;
}
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setAuthHeader = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
  }
  const login = async (email: string, password: string) => {
    try {
      const res = (await loginUser({ email, password })) as unknown as LoginResponse;
      if (res.success && res.token) {
        const userData = { ...res.data, authenticated: true };
        localStorage.setItem("user_profile", JSON.stringify(userData));
        localStorage.setItem("auth_token", res.token);
        setAuthHeader(res.token);
        setUser(userData);
      }
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_profile");
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = () => {
      try{
      const token = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("user_profile");
      
      if (token && savedUser) {
        setAuthHeader(token);
        setUser(JSON.parse(savedUser));
      }
     } catch (e) {
        console.error("Error initializing auth:", e);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
