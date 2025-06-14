import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper, Fade, Avatar } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const qrImages = {
  momo: "/images/qr-momo.png",
  zalopay: "/images/qr-zalopay.png",
  bank: "/images/qr-bank.png",
};

const tabIcons = {
  momo: <QrCodeIcon sx={{ color: "#a50064" }} />,
  zalopay: <PaymentIcon sx={{ color: "#008fe5" }} />,
  bank: <AccountBalanceIcon sx={{ color: "#2e7d32" }} />,
};

const bankInfo = {
  bankName: "Ngân hàng Sacombank",
  accountNumber: "070120524427",
  accountName: "NGUYEN THANH LOI",
  branch: "Chi nhánh Long An"
};

export default function Payment() {
  const [method, setMethod] = useState("momo");

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)"
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 5 },
          borderRadius: 5,
          minWidth: 350,
          boxShadow: 6,
          bgcolor: "#fff",
          maxWidth: 400,
          transition: "box-shadow 0.3s",
          "&:hover": { boxShadow: 12 }
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          mb={2}
          color="primary"
          sx={{
            textAlign: "center",
            letterSpacing: 1.2,
            textTransform: "uppercase"
          }}
        >
          Thanh toán qua QR
        </Typography>
        <Tabs
          value={method}
          onChange={(_, v) => setMethod(v)}
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
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}