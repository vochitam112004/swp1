import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="font-bold hover:underline">Trang chủ</Link>
        <Link to="/ranking" className="hover:underline">Xếp hạng</Link>
        <Link to="/blog" className="hover:underline">Blog</Link>
        <Link to="/plan" className="hover:underline">Kế hoạch</Link>
        <Link to="/progress" className="hover:underline">Tiến độ</Link>
        <Link to="/dashboard" className="hover:underline">Bảng điều</Link>
        <Link to="/profile" className="hover:underline">Hồ sơ</Link>
        <Link to="/membership" className="hover:underline">Thành viên</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <>
            <span>Xin chào, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
