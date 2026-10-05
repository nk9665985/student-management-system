import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  clearSession,
  getStoredUsername,
  getToken,
  login as apiLogin,
  register as apiRegister,
  setSession,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(getStoredUsername());
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!getToken() && !!username;

  const login = useCallback(async (user, pass) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await apiLogin(user, pass);
      setSession(data.token, data.username);
      setUsername(data.username);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registers a new account and, on success, logs them straight in - the
  // backend returns a token immediately so there's no separate login step.
  // Throws on failure (e.g. username taken) so the signup form can show its
  // own inline error, same pattern as the student/project form modals.
  const register = useCallback(async (user, pass) => {
    setLoading(true);
    try {
      const data = await apiRegister(user, pass);
      setSession(data.token, data.username);
      setUsername(data.username);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUsername(null);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => setUsername(null);
    window.addEventListener("sms:unauthorized", onUnauthorized);
    return () => window.removeEventListener("sms:unauthorized", onUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ username, isAuthenticated, login, register, logout, authError, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

