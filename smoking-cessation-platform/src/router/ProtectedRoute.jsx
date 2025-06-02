import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const user = auth?.user;
  return user ? children : <Navigate to="/login" />;
}