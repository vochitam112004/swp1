import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  MenuItem,
  Avatar,
  Menu,
} from "@mui/material";
import AssignedUsers from "./AssignedUsers";
import UserProgress from "./UserProgress";
import UserPlans from "./UserPlans";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileTabs from "../profile/ProfileTabs";
import "../../css/Coach.css";
import AppointmentList from "./AppointmentList";

export default function CoachDashboard() {
  const [tab, setTab] = useState(0);
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
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

      <Paper
        elevation={3}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: "#ffffff",
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "#1976d2 !important",
            },
          }}
        >
          <Tab label="Danh sách người dùng" />
          <Tab label="Tiến trình & Sức khỏe" />
          <Tab label="Danh sách lịch hẹn" />
        </Tabs>
      </Paper>

      {tab === 0 && <AssignedUsers />}
      {tab === 1 && <UserProgress />}
      {tab === 2 && <AppointmentList />}
      {tab === 3 && <ProfileTabs />}
    </Box>
  );
}
