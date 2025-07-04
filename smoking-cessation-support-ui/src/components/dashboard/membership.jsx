import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import api from "../../api/axios";
import "../../css/Membership.css";

export default function MembershipList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/MembershipPlan")
      .then((res) => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectPlan = (planId) => {
    window.location.href = `/payment?planId=${planId}`;
  };

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
        {plans.map((plan) => {
          const lower = plan.name.toLowerCase();
          const isFree = lower.includes("miễn phí") || lower.includes("cơ bản") || plan.price === 0;
          const isVIP = lower.includes("vip");
          const isPremium = lower.includes("premium");

          const cardClass = `membership-card ${
            isVIP ? "vip" : isPremium ? "popular" : ""
          }`;
          const titleClass = `membership-title ${
            isVIP ? "title-vip" : isPremium ? "title-premium" : "title-free"
          }`;
          const buttonClass = `action-btn ${
            isVIP ? "btn-vip" : isPremium ? "btn-premium" : "btn-free"
          }`;
          const buttonText = isFree
            ? "SỬ DỤNG MIỄN PHÍ"
            : isVIP
            ? "ĐĂNG KÝ VIP"
            : "ĐĂNG KÝ NGAY";

          return (
            <Grid item xs={12} md={4} key={plan.planId}>
              <Card className={cardClass}>
                <CardContent>
                  <Typography className={titleClass}>
                    {plan.name}
                  </Typography>
                  <Typography color="text.secondary" mb={1}>
                    Thời hạn: {plan.durationDays} ngày
                  </Typography>
                  <Typography className="membership-price">
                    {plan.price === 0
                      ? "Miễn phí"
                      : `${plan.price.toLocaleString()}đ`}
                    <span className="price-sub"> /tháng</span>
                  </Typography>
                  <Typography className="description" mt={1}>
                    {plan.description}
                  </Typography>
                  <Button
                    variant="contained"
                    className={buttonClass}
                    onClick={() => handleSelectPlan(plan.planId)}
                  >
                    {buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
