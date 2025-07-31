import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Fade,
  Button,
  CircularProgress,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import api from "../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const tabIcons = {
  momo: <CreditCardIcon sx={{ color: "#d82d8b" }} />, // Icon MoMo
};

export default function Payment() {
  const [method, setMethod] = useState("momo"); // Chỉ có MoMo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = parseInt(searchParams.get("planId"));

  useEffect(() => {
    if (!planId) {
      navigate("/membership");
      return;
    }

    api.get("/MembershipPlan")
      .then((res) => {
        const matched = res.data.find((p) => p.planId === planId);
        if (matched) setPlan(matched);
        else navigate("/membership");
      })
      .catch(() => navigate("/membership"));
  }, [planId, navigate]);

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Gọi API tạo thanh toán với planId
      const momoResponse = await api.post(`/UserMembershipPayment/CreatePaymentForPlan/${planId}`);

      console.log('🎯 MoMo Response:', momoResponse.data);

      if (momoResponse.data && momoResponse.data.payUrl) {
        // Log QR Code URL để có thể sử dụng sau này
        if (momoResponse.data.qrCodeUrl) {
          console.log('📱 QR Code URL:', momoResponse.data.qrCodeUrl);
        }
        
        // Chuyển hướng đến trang thanh toán MoMo
        window.location.href = momoResponse.data.payUrl;
      } else {
        setError("Không thể tạo thanh toán MoMo. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error('❌ Payment Error:', err);
      setError("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 5, mb: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
          Thanh toán gói: {plan.name}
        </Typography>
        <Typography fontWeight={500} mb={1}>
          Giá: {plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString()}đ`}
        </Typography>
        <Tabs
          value={method}
          onChange={(_, v) => setMethod(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              minWidth: 100,
              fontWeight: 600,
              borderRadius: 2,
              mx: 1,
            },
            "& .Mui-selected": {
              bgcolor: "primary.light",
              color: "#fff",
            },
          }}
        >
          <Tab icon={tabIcons.momo} label="MoMo" value="momo" />
        </Tabs>

        <Fade in>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            {/* UI cho MoMo */}
            <Box>
              <Box
                sx={{
                  width: 220,
                  height: 220,
                  mx: "auto",
                  mb: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #d82d8b 0%, #ff6b9d 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(216, 45, 139, 0.3)",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  MoMo
                </Typography>
              </Box>
              <Typography fontWeight={600} mb={2} sx={{ color: "#d82d8b" }}>
                Nhấn "Thanh toán MoMo" để chuyển đến ứng dụng MoMo
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  mt: 2,
                  p: 2.5,
                  background: "linear-gradient(90deg, #ffe0f0 0%, #fff0f8 100%)",
                  borderRadius: 3,
                }}
              >
                <Typography fontWeight={700} mb={1} color="#d82d8b">
                  💳 Thanh toán an toàn với MoMo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Thanh toán nhanh chóng và bảo mật<br />
                  • Không cần nhập thông tin thẻ<br />
                  • Hỗ trợ nhiều phương thức thanh toán
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleConfirmPayment}
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: 18,
                  background: "linear-gradient(90deg, #d82d8b 0%, #ff6b9d 100%)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #c02577 0%, #e55a8a 100%)",
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Thanh toán MoMo"
                )}
              </Button>
              {error && (
                <Typography color="error" mt={2}>
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
}