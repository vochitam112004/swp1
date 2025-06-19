//kiểm tra đăng nhập 
// nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("authToken");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}