// src/pages/Coach/CoachDashboard.jsx
import React from "react";
import { Typography, Box } from "@mui/material";

export default function CoachPage() {
  return (
    <Box p={3}>
      <Typography variant="h4" color="secondary">
        Trang của Coach
      </Typography>
      <Typography mt={2}>
        Đây là nơi Coach có thể quản lý các hoạt động của mình.
      </Typography>
    </Box>
  );
}
