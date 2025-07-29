import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("authToken");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAuthToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setAuthToken(userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", userData.token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
