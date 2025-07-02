import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  MenuItem,
  Avatar,
  Menu,
} from "@mui/material";
import AssignedUsers from "./AssignedUsers";
import UserProgress from "./UserProgress";
import SendAdvice from "./SendAdvice";
import UserPlans from "./UserPlans";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";

export default function CoachDashboard() {
  const [tab, setTab] = useState(0);
  const { user, logout } = useAuth(); // ✅ lấy user từ context
  const [anchorEl, setAnchorEl] = useState(null); // ✅ anchor cho menu
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget); // ✅ mở menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // ✅ gọi từ context
    handleMenuClose();
    navigate("/");
  };

  const handleProfile = () => {
    handleMenuClose();
    setTab(4); 
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2} color="secondary">
        Trang huấn luyện viên
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <Avatar
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "")}`}
          alt={user?.username}
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
      </Box>

      <Paper elevation={3} sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Người dùng được phân công" />
          <Tab label="Tiến trình & Sức khỏe" />
          <Tab label="Tư vấn cá nhân" />
          <Tab label="Huy hiệu động viên" />
          <Tab label="Hồ sơ huấn luyện viên"/>
        </Tabs>
      </Paper>

      {tab === 0 && <AssignedUsers />}
      {tab === 1 && <UserProgress />}
      {tab === 2 && <SendAdvice />}
      {tab === 3 && <UserPlans />}
      {tab === 4 && <Profile />}
    </Box>
  );
}
