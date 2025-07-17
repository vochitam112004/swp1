import React, { useEffect, useState, useContext } from "react";
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
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import api from "../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const qrImages = {
  zalopay: "/images/Qr-zalopay.jpg",
  bank: "/images/Qr-nganhang.jpg",
  momo: "/images/Qr-momo.jpg", // Thêm ảnh QR MoMo
};

const tabIcons = {
  zalopay: <PaymentIcon sx={{ color: "#008fe5" }} />,
  bank: <AccountBalanceIcon sx={{ color: "#2e7d32" }} />,
  momo: <CreditCardIcon sx={{ color: "#d82d8b" }} />, // Icon MoMo
};

const bankInfo = {
  bankName: "Ngân hàng Sacombank",
  accountNumber: "070120524427",
  accountName: "NGUYEN THANH LOI",
  branch: "Chi nhánh Long An",
};

export default function Payment() {
  const [method, setMethod] = useState("momo"); // Mặc định chọn MoMo
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(UserContext);
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
      if (method === "momo") {
        // Tạo orderId unique
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Lấy tên từ user context hoặc dùng tên mặc định
        const fullName = user?.fullName || user?.username || "Khách hàng";
        
        // Tạo thanh toán MoMo với API endpoint mới
        const momoResponse = await api.post("/api/UserMembershipPayment/CreatePaymentUrl", {
          orderId: orderId,
          amount: plan.price.toString(),
          fullName: fullName,
          orderInfo: `Thanh toán gói ${plan.name}`
        });

        if (momoResponse.data && momoResponse.data.payUrl) {
          // Chuyển hướng đến trang thanh toán MoMo
          window.location.href = momoResponse.data.payUrl;
        } else {
          setError("Không thể tạo thanh toán MoMo. Vui lòng thử lại.");
        }
      } else {
        // Thanh toán thủ công cho ZaloPay và Bank
        const transactionId = `manual-${Date.now()}`;

        await api.post("/UserMembershipPayment/process-payment", {
          planId: plan.planId,
          transactionId,
          amount: plan.price,
        });

        setSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
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
          <Tab icon={tabIcons.zalopay} label="ZaloPay" value="zalopay" />
          <Tab icon={tabIcons.bank} label="Ngân hàng" value="bank" />
        </Tabs>

        <Fade in>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            {method === "momo" ? (
              // UI cho MoMo
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
            ) : (
              // UI cho ZaloPay và Bank (code cũ)
              <Box>
                <img
                  src={qrImages[method]}
                  alt={`QR ${method}`}
                  style={{
                    width: 220,
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 24,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                    marginBottom: 16,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/qr-placeholder.png";
                  }}
                />
                <Typography fontWeight={500} mb={1}>
                  Quét mã QR bằng{" "}
                  <span style={{ color: "#1976d2", fontWeight: 700 }}>
                    {method === "zalopay" ? "ZaloPay" : "Ngân hàng"}
                  </span>{" "}
                  để thanh toán.
                </Typography>
              </Box>
            )}

            {method === "bank" && (
              <Paper
                elevation={3}
                sx={{
                  mt: 3,
                  p: 2.5,
                  textAlign: "left",
                  background:
                    "linear-gradient(90deg, #f3e5f5 0%, #e3f2fd 100%)",
                  borderRadius: 3,
                }}
              >
                <Typography fontWeight={700} mb={1}>
                  Hoặc chuyển khoản thủ công:
                </Typography>
                <Typography>
                  <CreditCardIcon sx={{ fontSize: 18, mr: 1, color: "#1976d2" }} />
                  Số tài khoản: <b>{bankInfo.accountNumber}</b>
                </Typography>
                <Typography>
                  Chủ tài khoản: <b>{bankInfo.accountName}</b>
                </Typography>
                <Typography>
                  Ngân hàng: <b>{bankInfo.bankName}</b>
                </Typography>
                <Typography>
                  Chi nhánh: <b>{bankInfo.branch}</b>
                </Typography>
                <Typography sx={{ mt: 1, color: "red" }}>
                  Nội dung chuyển khoản: <b>Thanh toán {plan.name}</b>
                </Typography>
              </Paper>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color={method === "momo" ? "secondary" : "primary"}
                onClick={handleConfirmPayment}
                disabled={loading || success}
                fullWidth
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: 18,
                  ...(method === "momo" && {
                    background: "linear-gradient(90deg, #d82d8b 0%, #ff6b9d 100%)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #c02577 0%, #e55a8a 100%)",
                    }
                  })
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : success ? (
                  "Đã thanh toán!"
                ) : method === "momo" ? (
                  "Thanh toán MoMo"
                ) : (
                  "Xác nhận đã thanh toán"
                )}
              </Button>
              {error && (
                <Typography color="error" mt={2}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="success.main" mt={2}>
                  Thanh toán thành công! Cảm ơn bạn.
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
}


