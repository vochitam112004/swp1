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

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const { logout } = useAuth(); // ✅ context đã có user và logout
  const [ setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout(); // ✅ gọi từ context
    handleMenuClose();
    navigate("/");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2} color="primary">
        Bảng điều khiển quản trị viên
      </Typography>
      <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>

      <Paper elevation={3} sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Quản lý Coach" />
          <Tab label="Quản lý người dùng" />
          <Tab label="Gói thành viên" />
          <Tab label="Phản hồi & Đánh giá" />
          <Tab label="Thống kê hệ thống" />
        </Tabs>
      </Paper>


      {/* {tab === 0 && <ManageCoach />}
      {tab === 1 && <UserManager />}
      {tab === 2 && <MembershipManager />}
      {tab === 3 && <FeedbackManager />}
      {tab === 4 && <DashboardOverview />} */}
    </Box>
  );
}
