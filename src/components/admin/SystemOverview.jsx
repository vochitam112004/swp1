import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import api from "../../api/axios";

export default function DashboardOverview() {
  const [userCount, setUserCount] = useState(0);
  const [coachCount, setCoachCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const userRes = await api.get("/User/Count-User");
      const coachRes = await api.get("/Coach/countCoach");

      setUserCount(Number(userRes.data));
      setCoachCount(Number(coachRes.data));
    } catch (error) {
      console.error("Lỗi khi lấy số lượng user/coach:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tổng quan hệ thống
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Tổng số người dùng</Typography>
            <Typography variant="h4" color="primary">{userCount}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Tổng số huấn luyện viên</Typography>
            <Typography variant="h4" color="secondary">{coachCount}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
