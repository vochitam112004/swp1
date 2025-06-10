import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Navigation = () => {
  useEffect(() => {
    const mobileMenuButton = document.querySelector('button[aria-controls="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        mobileMenu.classList.toggle('d-none');
      });
    }
    return () => {
      if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.removeEventListener('click', () => {});
      }
    };
  }, []);

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
          <span role="img" aria-label="logo" style={{ marginRight: 8 }}>🫁</span>
          Breathe Free
        </Link>
        <Box sx={{ ml: 4, display: "flex", gap: 3 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Trang chủ</Link>
          <Link to="/blog" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Blog</Link>
          <Link to="/bxh" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Bảng xếp hạng</Link>
          <Link to="/membership" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Gói thành viên</Link>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button component={Link} to="/login" variant="contained" color="primary">
          Đăng nhập
        </Button>
        <Button component={Link} to="/register" variant="contained" color="success">
          Đăng ký
        </Button>
      </Box>
    </Box>
  );
};

export default Navigation;