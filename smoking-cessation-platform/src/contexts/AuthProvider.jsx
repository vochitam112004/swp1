import { useState } from "react";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const u = username?.trim();
    const p = password?.trim();
    if (u === "member" && p === "123456") {
      setUser({ username: "member", role: "Member" });
      return true;
    }
    if (u === "coach" && p === "123456") {
      setUser({ username: "coach", role: "Coach" });
      return true;
    }
    if (u === "admin" && p === "123456") {
      setUser({ username: "admin", role: "Admin" });
      return true;
    }
    return false;
  };

  const register = (username) => {
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

export default AuthProvider;