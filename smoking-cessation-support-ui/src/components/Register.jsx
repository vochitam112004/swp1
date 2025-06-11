import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const membershipPlans = [
  { id: 1, name: "Cơ bản", price: 0 },
  { id: 2, name: "Nâng cao", price: 99000 },
  { id: 3, name: "Chuyên nghiệp", price: 199000 },
];

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", plan: 1 });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlanChange = (e) => {
    setForm({ ...form, plan: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Đăng ký thành công! Vui lòng thanh toán để kích hoạt gói.");
  };

  const handlePayment = () => {
    navigate("/payment");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          maxWidth: 400,
          width: "100%",
          background: "linear-gradient(135deg, #fff 60%, #e3f2fd 100%)",
          boxShadow:
            "0 8px 32px 0 rgba(33,147,176,0.18), 0 1.5px 8px 0 rgba(33,147,176,0.08)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <WorkspacePremiumIcon
            sx={{ fontSize: 48, color: "#1976d2", mb: 1 }}
          />
          <Typography variant="h5" fontWeight={700} color="primary" mb={1}>
            Đăng ký thành viên
          </Typography>
          <Typography color="text.secondary" fontSize={16}>
            Tham gia cộng đồng Breathe Free ngay hôm nay!
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              background: "#f8fafc",
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              background: "#f8fafc",
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel id="plan-label">
              <WorkspacePremiumIcon
                sx={{ mr: 1, fontSize: 20, color: "#1976d2" }}
              />
              Gói thành viên
            </InputLabel>
            <Select
              labelId="plan-label"
              name="plan"
              value={form.plan}
              label="Gói thành viên"
              onChange={handlePlanChange}
              sx={{
                borderRadius: 3,
                background: "#f8fafc",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            >
              {membershipPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}{" "}
                  {plan.price === 0
                    ? "(Miễn phí)"
                    : `(${plan.price.toLocaleString()} VNĐ/tháng)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: "0 4px 16px rgba(25, 118, 210, 0.12)",
              textTransform: "none",
              fontSize: 18,
              py: 1.5,
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
                transform: "translateY(-2px) scale(1.03)",
              },
            }}
            endIcon={<CheckCircleIcon />}
          >
            Đăng ký
          </Button>
        </form>
        {message && (
          <Box mt={3} textAlign="center">
            <Typography color="success.main" fontWeight={600} mb={1}>
              {message}
            </Typography>
            {form.plan !== 1 && message.includes("thành công") && (
              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  mt: 1,
                  textTransform: "none",
                  fontSize: 17,
                  py: 1.2,
                  background:
                    "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(67,233,123,0.12)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)",
                    transform: "translateY(-2px) scale(1.03)",
                  },
                }}
                onClick={handlePayment}
              >
                Thanh toán & kích hoạt
              </Button>
            )}
          </Box>
        )}
        <Divider sx={{ my: 3, fontWeight: 700, color: "#1976d2" }}>
          Đã có tài khoản?
        </Divider>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={
            <PersonIcon
              sx={{
                color: "#1976d2",
                fontSize: 24,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.2)" },
              }}
            />
          }
          sx={{
            fontWeight: 700,
            fontSize: 17,
            borderRadius: 3,
            textTransform: "none",
            borderWidth: 2,
            borderColor: "#1976d2",
            background: "linear-gradient(90deg, #e3f2fd 60%, #fff 100%)",
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
            transition: "all 0.2s",
            py: 1.3,
            mb: 1,
            "&:hover": {
              background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
              color: "#fff",
              borderColor: "#1976d2",
              boxShadow: "0 4px 16px rgba(25, 118, 210, 0.18)",
              transform: "translateY(-2px) scale(1.03)",
            },
          }}
          onClick={() => navigate("/login")}
        >
          Đăng nhập ngay
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{
            fontWeight: 700,
            fontSize: 17,
            borderRadius: 3,
            textTransform: "none",
            mt: 1,
            py: 1.3,
            background: "linear-gradient(90deg, #fff 60%, #ea4335 100%)",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(234, 67, 53, 0.08)",
            "&:hover": {
              background: "linear-gradient(90deg, #ea4335 60%, #fff 100%)",
              color: "#ea4335",
              borderColor: "#ea4335",
              boxShadow: "0 4px 16px rgba(234, 67, 53, 0.18)",
              transform: "translateY(-2px) scale(1.03)",
            },
          }}
          // TODO: Thêm logic đăng nhập/đăng ký Google ở đây
          onClick={() => alert("Chức năng Google chưa được tích hợp!")}
        >
          Đăng ký / Đăng nhập bằng Google
        </Button>
      </Paper>
    </Box>
  );
}