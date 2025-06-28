import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../auth/AuthContext"; // ✅ dùng context

const Navigation = () => {
  const { user, logout } = useAuth(); // ✅ context đã có user và logout
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogout = () => {
    logout(); // ✅ gọi từ context
    handleMenuClose();
    navigate("/");
  };

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        px: 4,
        bgcolor: "#fff",
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#1976d2", fontWeight: 700, fontSize: 22 }}>
          <img
            src="/images/logo.jpg"
            alt="Logo"
            style={{ height: 50, marginRight: 15, verticalAlign: "middle" }}
          />
          Breathe Free
        </Link>
        <Box sx={{ ml: 4, display: "flex", gap: 3 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Trang chủ</Link>
          <Link to="/blog" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Blog</Link>
          <Link to="/bxh" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Bảng xếp hạng</Link>
          <Link to="/membership" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Gói thành viên</Link>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {user ? (
          <>
            <Avatar
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`}
              alt={user.username}
              sx={{ cursor: "pointer" }}
              onClick={handleAvatarClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfile}>Xem hồ sơ</MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" variant="contained" color="primary">
              Đăng nhập
            </Button>
            <Button component={Link} to="/register" variant="contained" color="success">
              Đăng ký
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navigation;
