import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  MenuItem,
} from "@mui/material";
import ManageCoach from "./ManageCoach";
import UserManager from "./UserManager";
import MembershipManager from "./MembershipManager";
import FeedbackManager from "./FeedbackManager";
import DashboardOverview from "./DashboardOverview";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import SystemReportManager from "./SystemReportManager";

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const { logout } = useAuth();
  const [setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };
  
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#1976d2",
          mb: 2,
        }}
      >
        Bảng điều khiển quản trị viên
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <MenuItem
          onClick={handleLogout}
          sx={{
            backgroundColor: "#e53935",
            color: "white",
            borderRadius: "8px",
            px: 2,
            py: 1,
            width: "fit-content",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#c62828",
            },
          }}
        >
          Đăng xuất
        </MenuItem>
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
          <Tab label="Quản lý Coach" />
          <Tab label="Quản lý người dùng" />
          <Tab label="Gói thành viên" />
          <Tab label="Phản hồi & Đánh giá" />
          <Tab label="Thống kê hệ thống" />
          <Tab label="Báo cáo hệ thống" />
        </Tabs>
      </Paper>

      {tab === 0 && <ManageCoach />}
      {tab === 1 && <UserManager />}
      {tab === 2 && <MembershipManager />}
      {tab === 3 && <FeedbackManager />}
      {tab === 4 && <DashboardOverview />}
      {tab === 5 && <SystemReportManager />}
    </Box>
  );
}
