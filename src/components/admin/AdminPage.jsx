import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  MenuItem,
  Stack
} from "@mui/material";
import ManageCoach from "./ManageCoach";
import UserManager from "./UserManager";
import MembershipManager from "./MembershipManager";
import FeedbackManager from "./FeedbackManager";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import BadgeManager from "./BadgeManager";
import SystemOverview from "./SystemOverview";
import AchievementTemplateManager from "./AchievementTemplateManager";
import UserAchievementManager from "./UserAchievementManager";

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header + Logout */}
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
            Trang quản lý Breath Free
          </Typography>

          <MenuItem
            onClick={handleLogout}
            sx={{
              backgroundColor: "#e53935",
              color: "white",
              borderRadius: "6px",
              px: 2,
              py: 1,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
          >
            Đăng xuất
          </MenuItem>
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
          <Tab label="Quản lý Coach" />
          <Tab label="Quản lý người dùng" />
          <Tab label="Gói thành viên" />
          <Tab label="Phản hồi & Đánh giá" />
          <Tab label="Quản lí huy hiệu" />
          <Tab label="Mẫu thành tích" />
        </Tabs>
      </Box>

      {/* Nội dung tab */}
      <Box sx={{ px: 4, py: 3 }}>
        {tab === 0 && <ManageCoach />}
        {tab === 1 && <UserManager />}
        {tab === 2 && <MembershipManager />}
        {tab === 3 && <FeedbackManager />}
        {tab === 4 && <BadgeManager />}
        {tab === 5 && <AchievementTemplateManager />}
      </Box>
    </Box>
  );
}
