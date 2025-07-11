import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button
} from "@mui/material";
import api from "../../api/axios";
import "../../css/Membership.css";
import { useNavigate } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';

export default function MembershipList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/MembershipPlan")
      .then((res) => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectPlan = (planId) => {
    navigate(`/payment?planId=${planId}`);
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
      <Typography variant="h4" mb={4} textAlign="center" color="primary" fontWeight={700}>
        Chọn gói thành viên phù hợp với bạn
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => {
          const name = plan.name.toLowerCase();
          const isFree = name.includes("miễn phí") || name.includes("cơ bản") || plan.price === 0;
          const isPremium = name.includes("premium");
          const isVIP = name.includes("vip");

          const titleColor = isVIP ? "#d4af37" : isPremium ? "#1976d2" : "#43a047";
          const Icon = isVIP ? StarIcon : isPremium ? BoltIcon : CheckCircleIcon;
          const buttonText = isFree ? "SỬ DỤNG MIỄN PHÍ" : isVIP ? "ĐĂNG KÝ VIP" : "ĐĂNG KÝ NGAY";

          return (
            <Grid item xs={12} sm={6} md={4} key={plan.planId}>
              <Card className="membership-card">
                <CardContent>
                  <Typography
                    className={`membership-title ${isVIP ? "title-vip" : isPremium ? "title-premium" : "title-free"}`}
                    variant="h5"
                  >
                    {plan.name}
                  </Typography>

                  <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    ⏱️ Thời hạn: <strong>{plan.durationDays} ngày</strong>
                  </Typography>

                  <Typography
                    className="membership-price"
                    sx={{ color: titleColor }}
                  >
                    {plan.price === 0
                      ? "Miễn phí"
                      : `${plan.price.toLocaleString()}đ`}
                    <span className="price-sub"> /tháng</span>
                  </Typography>

                  <Typography className="description">
                    {plan.description}
                  </Typography>

                  <Button
                    fullWidth
                    className={`action-btn ${isFree ? "btn-free" : isVIP ? "btn-vip" : "btn-premium"}`}
                    sx={{
                      mt: 3,
                      px: 2,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: 16,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                    onClick={() => handleSelectPlan(plan.planId)}
                  >
                    <Icon fontSize="small" className="btn-icon" />
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
