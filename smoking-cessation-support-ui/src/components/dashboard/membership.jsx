import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from "@mui/material";
import api from "../../api/axios";

export default function MembershipList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/MembershipPlan")
      .then(res => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} textAlign="center" color="primary">
        Danh sách gói thành viên
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {plans.map(plan => (
          <Grid item xs={12} md={4} key={plan.planId}>
            <Card sx={{ borderRadius: 3, minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {plan.name}
                </Typography>
                <Typography color="text.secondary" mb={1}>
                  Thời hạn: {plan.durationDays} ngày
                </Typography>
                <Typography color="text.secondary" mb={1}>
                  Giá: {plan.price.toLocaleString()} VNĐ
                </Typography>
                <Typography color="text.secondary">
                  {plan.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}