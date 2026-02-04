import { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
  const [loading] = useState<boolean>(true);

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
    // Extract common user fields from response (handle different shapes)
    const userFromRes: any = res?.user || res?.data?.user || res?.data || res;
    const userId = userFromRes?.id || userFromRes?.user_id || userFromRes?.uid;
    const emailFromRes = userFromRes?.email || res?.email || res?.data?.email;
    const firstName = userFromRes?.first_name || userFromRes?.firstname || userFromRes?.given_name || userFromRes?.name?.split?.(' ')?.[0];
    const lastName = userFromRes?.last_name || userFromRes?.lastname || userFromRes?.family_name || (userFromRes?.name ? userFromRes.name.split(' ').slice(1).join(' ') : undefined);
    const fullName = userFromRes?.name || `${firstName || ''}${firstName && lastName ? ' ' : ''}${lastName || ''}` || undefined;

    const userPayload: any = {
      id: userId,
      email: emailFromRes,
      first_name: firstName,
      last_name: lastName,
      name: fullName,
      authenticated: !!token,
    };

    // Persist individual user fields for later initialization
    try {
      if (userPayload.id !== undefined && userPayload.id !== null) localStorage.setItem('user_id', String(userPayload.id));
      if (userPayload.email) localStorage.setItem('user_email', String(userPayload.email));
      if (userPayload.first_name) localStorage.setItem('user_first_name', String(userPayload.first_name));
      if (userPayload.last_name) localStorage.setItem('user_last_name', String(userPayload.last_name));
      if (userPayload.name) localStorage.setItem('user_name', String(userPayload.name));
      if (token) localStorage.setItem('auth_token', token);
    } catch (e) {
      // ignore storage errors
    }

    // Prefer explicit user object from API, fall back to constructed payload
    if (res?.user) setUser(res.user);
    else setUser(userPayload);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    // Remove auth header for future requests
    try {
      if (api && api.defaults && api.defaults.headers) {
        // Some axios versions use common header storage
        if (api.defaults.headers.Authorization) delete api.defaults.headers.Authorization;
        if (api.defaults.headers.common && api.defaults.headers.common.Authorization) delete api.defaults.headers.common.Authorization;
      }
    } catch (e) {
      // ignore
    }
    // Clear persisted user fields
    try {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_first_name');
      localStorage.removeItem('user_last_name');
      localStorage.removeItem('user_name');
    } catch (e) {
      // ignore
    }

    setUser(null);
  };

  useEffect(() => {
    // Initialize auth from stored token and user fields (if any)
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.Authorization = `Bearer ${token}`;

      // Try to restore detailed user info from localStorage
      try {
        const id = localStorage.getItem('user_id');
        const email = localStorage.getItem('user_email');
        const first_name = localStorage.getItem('user_first_name');
        const last_name = localStorage.getItem('user_last_name');
        const name = localStorage.getItem('user_name');

        const restoredUser: any = { authenticated: true };
        if (id) restoredUser.id = Number(id);
        if (email) restoredUser.email = email;
        if (first_name) restoredUser.first_name = first_name;
        if (last_name) restoredUser.last_name = last_name;
        if (name) restoredUser.name = name;

        setUser(restoredUser);
      } catch (e) {
        setUser({ authenticated: true });
      }
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
