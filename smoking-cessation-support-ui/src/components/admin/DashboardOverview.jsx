import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import api from "../../api/axios";

export default function DashboardOverview() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/Admin/statistics");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={2}>Thống kê tổng quan</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}><Paper sx={{ p: 2 }}>Tổng user: {stats.totalUsers}</Paper></Grid>
        <Grid item xs={6}><Paper sx={{ p: 2 }}>Doanh thu: {stats.totalRevenue} VNĐ</Paper></Grid>
        <Grid item xs={6}><Paper sx={{ p: 2 }}>Tỷ lệ thành công: {stats.successRate}%</Paper></Grid>
        <Grid item xs={6}><Paper sx={{ p: 2 }}>Tổng coach: {stats.totalCoaches}</Paper></Grid>
      </Grid>
    </Box>
  );
}