import React, { createContext, useState, useEffect, useContext } from "react";
export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Initial loading TRUE
  const [token, setToken] = useState(null);
  // Check for authentication on initial load
  useEffect(() => {
    console.log('🔐 AuthContext: Initializing...');
    
    const storedToken = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (storedToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ AuthContext: User found in localStorage:', parsedUser);
        console.log('👤 User Role:', parsedUser.role);
        
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ AuthContext: Error parsing user data:', error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      console.log('⚠️ AuthContext: No authentication found');
    }
    
    setLoading(false); // ✅ Loading complete
  }, []);
  // Fetch herbs from API
  const getHerbs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/herbs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setHerbs(data);
      console.log('🌿 Herbs loaded:', data.length);
    } catch (error) {
      console.error("❌ Error fetching herbs:", error);
    } finally {
      setLoading(false);
    }
  };
  // Login function (can be called from Login component)
  const login = (authToken, userData) => {
    console.log('🔓 AuthContext: Logging in user:', userData);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };
  // Logout function
  const logout = () => {
    console.log('🔒 AuthContext: Logging out...');
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
