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
import { useNavigate } from "react-router-dom";

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
      <Typography
        variant="h4"
        mb={4}
        textAlign="center"
        color="primary"
        fontWeight={700}
      >
        Chọn gói thành viên phù hợp với bạn
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => {
          const name = plan.name.toLowerCase();
          const isFree = name.includes("miễn phí") || name.includes("cơ bản") || plan.price === 0;
          const isPremium = name.includes("premium");
          const isVIP = name.includes("vip");
          const buttonText = isFree ? "SỬ DỤNG MIỄN PHÍ" : isVIP ? "ĐĂNG KÝ VIP" : "ĐĂNG KÝ NGAY";

          return (
            <Grid
              item
              key={plan.planId}
              sx={{ width: { xs: "100%", sm: 300 } }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      color: isVIP ? "#8e24aa" : isPremium ? "#1976d2" : "#2e7d32",
                      mb: 1,
                    }}
                  >
                    {plan.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ⏱️ Thời hạn: <strong>{plan.durationDays} ngày</strong>
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      color: isVIP ? "#8e24aa" : isPremium ? "#1976d2" : "#2e7d32",
                    }}
                  >
                    {plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString()}đ`}
                    <Typography variant="caption" component="span" sx={{ ml: 0.5 }}>
                      /tháng
                    </Typography>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "text.secondary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {plan.description}
                  </Typography>
                </CardContent>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleSelectPlan(plan.planId)}
                  sx={{
                    mt: 2,
                    py: 1.2,
                    fontWeight: 600,
                    borderRadius: 2,
                    backgroundColor: isFree
                      ? "#2e7d32"
                      : isPremium
                      ? "#1976d2"
                      : "#8e24aa",
                    "&:hover": {
                      backgroundColor: isFree
                        ? "#27632a"
                        : isPremium
                        ? "#1565c0"
                        : "#7b1fa2",
                    },
                  }}
                >
                  {buttonText}
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
