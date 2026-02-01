// frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base URL for your backend
  const API_URL = "http://localhost:5000/api";

  // Load user from localStorage AFTER component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false); // Mark loading as complete
  }, []);

  const login = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      return res.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);