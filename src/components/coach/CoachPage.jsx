import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import UserPlans from "./UserPlans";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileTabs from "../profile/ProfileTabs";
import UserProfileList from "./UserProfileList";
import UserProgress from "./UserProgress";
import "../../css/Coach.css";
import AppointmentList from "./AppointmentList";

export default function CoachDashboard() {
  const [tab, setTab] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleTabChange = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();
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
    setTab(3);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#fff",
          px: 4,
          py: 3,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#1976d2"
          >
            Trang huấn luyện viên
          </Typography>

          <Box>
            <Avatar
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "")}`
              }
              alt={user?.username}
              sx={{ width: 40, height: 40, cursor: "pointer" }}
              onClick={handleAvatarClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfile}>Xem hồ sơ</MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "white",
                  backgroundColor: "#e53935",
                  "&:hover": {
                    backgroundColor: "#c62828",
                  },
                }}
              >
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Stack>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mt: 2,
            "& .MuiTab-root": {
              fontWeight: "normal",
              textTransform: "none",
              minWidth: "auto",
              mr: 3,
              color: "#333",
              "&:focus": {
                outline: "none"
              }
            },
            "& .Mui-selected": {
              color: "#1976d2 !important",
              fontWeight: "bold",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          <Tab label="Hồ sơ thành viên" />
          <Tab label="Tiến trình & Sức khỏe" />
          <Tab label="Danh sách lịch hẹn" />
          <Tab label="Hồ sơ cá nhân" />
        </Tabs>
      </Box>

      {/* Nội dung tab */}
      <Box sx={{ px: 4, py: 3 }}>
        {tab === 0 && <UserProfileList />}
        {tab === 1 && <UserProgress />}
        {tab === 2 && <AppointmentList />}
        {tab === 3 && <ProfileTabs />}
      </Box>
    </Box>
  );
}
