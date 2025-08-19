import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// import BASE_URL from "../api";
const BASE_URL = "https://expense-tracker-ct27.onrender.com/api" || "http://localhost:5000/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token
  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/auth/user`, {
        headers: { 'x-auth-token': token },
      });
      setUser(res.data);
      setError(null);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      setError(err?.response?.data?.msg || "Authentication failed");
    }
    setLoading(false);
  };

  // Login
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, credentials);
      localStorage.setItem("token", res.data.token);
      await loadUser();
      setError(null);
      return true;
    } catch (err) {
      setError(err?.response?.data?.msg || "Login failed");
      return false;
    }
  };

  // Register
  const register = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, formData);
      localStorage.setItem("token", res.data.token);
      await loadUser();
      setError(null);
      return true;
    } catch (err) {
      setError(err?.response?.data?.msg || "Registration failed");
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const clearErrors = () => setError(null);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        error,
        clearErrors,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
