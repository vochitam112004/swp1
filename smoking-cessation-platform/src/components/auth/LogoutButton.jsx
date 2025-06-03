import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Button onClick={handleLogout}>Đăng xuất</Button>
  );
}