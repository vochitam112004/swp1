import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../auth/LogoutButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <Link to="/" className="font-bold text-lg">Nền tảng Cai nghiện Thuốc lá</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Xin chào, {user.username}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 mr-2">Đăng nhập</Link>
            <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}