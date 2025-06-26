import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import AssignedUsers from "./AssignedUsers";
import UserProgress from "./UserProgress";
import SendAdvice from "./SendAdvice";
import UserPlans from "./UserPlans";

export default function CoachDashboard() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2} color="secondary">
        Trang huấn luyện viên
      </Typography>

      <Paper elevation={3} sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Người dùng được phân công" />
          <Tab label="Tiến trình & Sức khỏe" />
          <Tab label="Tư vấn cá nhân" />
          <Tab label="Huy hiệu động viên" />
        </Tabs>
      </Paper>

      {tab === 0 && <AssignedUsers />}
      {tab === 1 && <UserProgress />}
      {tab === 2 && <SendAdvice />}
      {tab === 3 && <UserPlans />}
    </Box>
  );
}
