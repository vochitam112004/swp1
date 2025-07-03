import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../auth/AuthContext"; // ✅ dùng context
import "../../css/navigation.css";

const Navigation = () => {
  const { user, logout } = useAuth(); // ✅ context đã có user và logout
  const [anchorEl, setAnchorEl] = useState(null);
  const [blogAnchorEl, setBlogAnchorEl] = useState(null); // Thêm state cho menu Blog
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
  const handleBlogMenuOpen = (event) => {
    setBlogAnchorEl(event.currentTarget);
  };
  const handleBlogMenuClose = () => {
    setBlogAnchorEl(null);
  };

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.2,
        px: 4,
        backgroundColor: "#e2e6ea",
        boxShadow: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#1976d2", fontWeight: 700, fontSize: 22 }}>
          <img
            src="/images/logo.jpg"
            alt="Logo"
            style={{
              height: 50, marginRight: 15, verticalAlign: "middle",
              borderRadius: 12, // ✅ Bo góc
            }}
          />
          Breathe Free
        </Link>
        <Box sx={{ ml: 4, display: "flex", gap: 2 }}>
          <Link to="/" className="nav-link">Trang chủ</Link>

          <Link to="#" className="nav-link" onClick={handleBlogMenuOpen}
            style={{ cursor: "pointer" }} // để hiện tay trỏ khi hover
          >
            Blog
          </Link>
          <Menu
            anchorEl={blogAnchorEl}
            open={Boolean(blogAnchorEl)}
            onClose={handleBlogMenuClose}
            MenuListProps={{ onMouseLeave: handleBlogMenuClose }}
          >
            <MenuItem component={Link} to="/blog" onClick={handleBlogMenuClose}>Blog chia sẻ</MenuItem>
            <MenuItem component={Link} to="research" onClick={handleBlogMenuClose}>Nghiên cứu</MenuItem>
            <MenuItem component={Link} to="faq" onClick={handleBlogMenuClose}>Câu hỏi thường gặp</MenuItem>
          </Menu>

          <Link to="/bxh" className="nav-link">Bảng xếp hạng</Link>
          <Link to="/membership" className="nav-link">Gói thành viên</Link>
          <Link to="/dashboard" className="nav-link">Dữ liệu cá nhân</Link>
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
              <MenuItem onClick={handleProfile}>Thông tin cá nhân</MenuItem>
              <MenuItem onClick={() => { navigate("/dashboard"); handleMenuClose(); }}>Trung tâm người dùng</MenuItem>
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
