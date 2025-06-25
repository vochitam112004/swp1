// src/components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * @param {JSX.Element} children - Component con cần được bảo vệ
 * @param {Array<string>} allowedRoles - Các vai trò được phép vào
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // Chưa đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    // Không đủ quyền
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
