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
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import api from "../../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const qrImages = {
  zalopay: "/images/Qr-zalopay.jpg",
  bank: "/images/Qr-nganhang.jpg",
};

const tabIcons = {
  zalopay: <PaymentIcon sx={{ color: "#008fe5" }} />,
  bank: <AccountBalanceIcon sx={{ color: "#2e7d32" }} />,
};

const bankInfo = {
  bankName: "Ngân hàng Sacombank",
  accountNumber: "070120524427",
  accountName: "NGUYEN THANH LOI",
  branch: "Chi nhánh Long An",
};

export default function Payment() {
  const [method, setMethod] = useState("bank");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
  }, [planId]);

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");

    try {
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
          <Tab icon={tabIcons.zalopay} label="ZaloPay" value="zalopay" />
          <Tab icon={tabIcons.bank} label="Ngân hàng" value="bank" />
        </Tabs>

        <Fade in>
          <Box sx={{ mt: 3, textAlign: "center" }}>
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
                color="primary"
                onClick={handleConfirmPayment}
                disabled={loading || success}
                fullWidth
                sx={{ py: 1.2, fontWeight: 700, fontSize: 18 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : success ? (
                  "Đã thanh toán!"
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
