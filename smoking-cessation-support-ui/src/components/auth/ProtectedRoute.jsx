import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Đang kiểm tra quyền truy cập...</p>; // hoặc spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
