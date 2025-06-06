import { useAuth } from "../contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Bảng điều khiển</h2>
      <p>Xin chào <b>{user?.username}</b>! Bạn đang đăng nhập với vai trò <b>{user?.role}</b>.</p>
      {/* Tuỳ role, render các component khác nhau */}
    </div>
  );
}