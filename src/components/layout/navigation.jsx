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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Thêm state cho mobile menu
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.nav-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <Box
      component="nav"
      className="nav-container"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.2,
        px: 4,
        backgroundColor: "#e2e6ea",
        boxShadow: 2,
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Link to="/" className="nav-brand">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="nav-logo"
          />
          Breathe Free
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        
        <Box className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Trang chủ
          </Link>

          <Link 
            to="#" 
            className="nav-link" 
            onClick={(e) => {
              handleBlogMenuOpen(e);
              closeMobileMenu();
            }}
            style={{ cursor: "pointer" }}
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
            <MenuItem component={Link} to="/research" onClick={handleBlogMenuClose}>Nghiên cứu</MenuItem>
            <MenuItem component={Link} to="/faq" onClick={handleBlogMenuClose}>Câu hỏi thường gặp</MenuItem>
          </Menu>

          <Link to="/bxh" className="nav-link" onClick={closeMobileMenu}>
            Bảng xếp hạng
          </Link>
          <Link to="/coaches" className="nav-link" onClick={closeMobileMenu}>
            Huấn luyện viên
          </Link>
          <Link to="/membership" className="nav-link" onClick={closeMobileMenu}>
            Gói thành viên
          </Link>
          <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
            Dữ liệu cá nhân
          </Link>
        </Box>
      </Box>

      <Box className="nav-actions">
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
