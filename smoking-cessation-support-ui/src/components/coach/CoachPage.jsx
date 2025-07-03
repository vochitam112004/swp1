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
import "../../css/Coach.css"; 

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
    <Box className="coach-container">
      <div className="coach-title" variant="h4" color="secondary">
        Trang huấn luyện viên
      </div>

      <Box className="coach-header">
        <Avatar
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "")}`}
          alt={user?.username}
          className="coach-avatar"
          sx={{ cursor: "pointer" }}
          onClick={handleAvatarClick}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="coach-menu"
        >
          <MenuItem onClick={handleProfile}>Xem hồ sơ</MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Box>

      <Paper elevation={3} className="coach-tabs">
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Người dùng được phân công" />
          <Tab label="Tiến trình & Sức khỏe" />
          <Tab label="Tư vấn cá nhân" />
          <Tab label="Huy hiệu động viên" />
          <Tab label="Hồ sơ huấn luyện viên" />
        </Tabs>
      </Paper>

      {tab === 0 && <div className="coach-tab-panel"><AssignedUsers /></div>}
      {tab === 1 && <div className="coach-tab-panel"><UserProgress /></div>}
      {tab === 2 && <div className="coach-tab-panel"><SendAdvice /></div>}
      {tab === 3 && <div className="coach-tab-panel"><UserPlans /></div>}
      {tab === 4 && <div className="coach-tab-panel"><Profile /></div>}
    </Box>
  );
}
