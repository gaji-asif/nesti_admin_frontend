import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { loginUser, LoginCredentials } from "../api/authenticationApi";
import { api } from "../api/config";

export interface User {
  id?: number;
  email?: string;
  name?: string;
  authenticated?: boolean;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    const res = await loginUser({ email, password } as LoginCredentials);
    const token = res?.token || res?.access_token || res?.data?.token || res?.token;
    if (token) {
      localStorage.setItem("auth_token", token);
      // set default header for future requests
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
    // Optionally set user from response
    if (res?.user) setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  useEffect(() => {
    // Initialize auth from stored token (if any)
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.Authorization = `Bearer ${token}`;
      // set a lightweight user marker; ideally, call an endpoint to fetch user
      setUser({ authenticated: true });
    }
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

export default AuthContext;
