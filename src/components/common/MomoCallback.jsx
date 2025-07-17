import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Button, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function MomoCallback() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Lấy tất cả query parameters từ URL
        const params = {};
        for (const [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        // Gửi thông tin callback đến backend để xác thực
        const response = await api.post("/api/UserMembershipPayment/ProcessCallback", params);
        
        if (response.data.success) {
          setSuccess(true);
          setOrderInfo(response.data.orderInfo);
        } else {
          setError(response.data.message || "Thanh toán thất bại");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError("Có lỗi xảy ra khi xử lý thanh toán");
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [searchParams]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2, color: "#d82d8b" }} />
        <Typography variant="h6" color="text.secondary">
          Đang xử lý thanh toán...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3 }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        {success ? (
          <>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" fontWeight={700} color="success.main" mb={2}>
              Thanh toán thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </Typography>
            {orderInfo && (
              <Box sx={{ mb: 3, textAlign: "left" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thông tin đơn hàng:
                </Typography>
                <Typography>Mã đơn: {orderInfo.orderId}</Typography>
                <Typography>Số tiền: {orderInfo.amount}</Typography>
                <Typography>Tên khách hàng: {orderInfo.fullName}</Typography>
                <Typography>Mô tả: {orderInfo.orderInfo}</Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{ mt: 2, px: 4 }}
            >
              Về trang chủ
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color="error.main" mb={2}>
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {error || "Có lỗi xảy ra trong quá trình thanh toán"}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/membership")}
                sx={{ px: 3 }}
              >
                Thử lại
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ px: 3 }}
              >
                Về trang chủ
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
