import React, { createContext, useState, useEffect, useContext } from "react";
import { API_URL, normalizeApiResponse } from "./api";
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Initial loading TRUE
  const [token, setToken] = useState(null);
  // Check for authentication on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (storedToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ AuthContext: Error parsing user data:', error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false); // ✅ Loading complete
  }, []);
  // Fetch herbs from API
  const getHerbs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/herbs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('❌ getHerbs API error:', response.status, err);
        setHerbs([]);
        return;
      }

      const data = await response.json();
      const normalized = normalizeApiResponse(data);
      setHerbs(normalized);
    } catch (error) {
      console.error('❌ Error fetching herbs:', error);
      setHerbs([]);
    } finally {
      setLoading(false);
    }
  };
  // Login function (can be called from Login component)
  const login = (authToken, userData) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setHerbs([]);
  };
  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    userId: user?.id,
    token,
    setToken,
    herbs,
    loading,
    getHerbs,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthProvider;
