import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper, Fade, Avatar, Button, CircularProgress } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import api from "../../api/axios";

const qrImages = {
  momo: "/images/qr-momo.png",
  zalopay: "/images/qr-zalopay.png",
  bank: "/images/qr-bank.png",
  vnpay: "/images/qr-vnpay.png", // Thêm ảnh QR cho VNPay
};

const tabIcons = {
  momo: <QrCodeIcon sx={{ color: "#a50064" }} />,
  zalopay: <PaymentIcon sx={{ color: "#008fe5" }} />,
  bank: <AccountBalanceIcon sx={{ color: "#2e7d32" }} />,
  vnpay: <PaymentIcon sx={{ color: "#1a73e8" }} />, // Icon cho VNPay
};

const bankInfo = {
  bankName: "Ngân hàng Sacombank",
  accountNumber: "070120524427",
  accountName: "NGUYEN THANH LOI",
  branch: "Chi nhánh Long An"
};

export default function Payment({ onPaymentSuccess }) {
  const [method, setMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Hàm xác nhận thanh toán tự động (giả lập)
  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");
    try {
      // Gọi API xác nhận thanh toán (thay endpoint phù hợp backend)
      const res = await api.post("/payment/confirm", { method });
      setSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess({ method, ...res.data });
    } catch (error) {
      console.log(error)
      setError("Xác nhận thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 5, mb: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
          Thanh toán qua QR
        </Typography>
        <Tabs
          value={method}
          onChange={(_, v) => setMethod(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          centered
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              minWidth: 100,
              fontWeight: 600,
              borderRadius: 2,
              mx: 1,
              transition: "background 0.2s, color 0.2s",
              "&:hover": {
                bgcolor: "#f3e5f5",
                color: "primary.main"
              }
            },
            "& .Mui-selected": {
              bgcolor: "primary.light",
              color: "#fff"
            }
          }}
        >
          <Tab icon={tabIcons.momo} label="Momo" value="momo" />
          <Tab icon={tabIcons.zalopay} label="ZaloPay" value="zalopay" />
          <Tab icon={tabIcons.bank} label="Ngân hàng" value="bank" />
          <Tab icon={tabIcons.vnpay} label="VNPay" value="vnpay" /> {/* Thêm tab VNPay */}
        </Tabs>
        <Fade in>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Avatar
              variant="rounded"
              src={qrImages[method]}
              alt={`QR ${method}`}
              sx={{
                width: 220,
                height: 220,
                mx: "auto",
                mb: 2,
                boxShadow: 6,
                borderRadius: 6,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" }
              }}
            />
            <Typography fontWeight={500} mb={1}>
              Quét mã QR bằng ứng dụng{" "}
              <span style={{ color: "#1976d2", fontWeight: 700 }}>
                {method === "momo"
                  ? "Momo"
                  : method === "zalopay"
                  ? "ZaloPay"
                  : method === "vnpay"
                  ? "VNPay"
                  : "Ngân hàng"}
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
                  background: "linear-gradient(90deg, #f3e5f5 0%, #e3f2fd 100%)",
                  borderRadius: 3
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
                  Nội dung chuyển khoản: <b>Thanh toán [Tên đăng nhập]</b>
                </Typography>
              </Paper>
            )}
            {/* Nút xác nhận thanh toán */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPayment}
                disabled={loading || success}
                fullWidth
                sx={{ py: 1.2, fontWeight: 700, fontSize: 18 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : success ? "Đã thanh toán!" : "Xác nhận đã thanh toán"}
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