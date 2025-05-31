import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    if (username === "member" && password === "123456") {
      setUser({ username: "member", role: "Member" });
      return true;
    }
    if (username === "coach" && password === "123456") {
      setUser({ username: "coach", role: "Coach" });
      return true;
    }
    if (username === "admin" && password === "123456") {
      setUser({ username: "admin", role: "Admin" });
      return true;
    }
    return false;
  };

  const register = (username, password) => {
    setUser({ username, role: "Member" });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}