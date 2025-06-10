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
} from "@mui/material";

const membershipPlans = [
  { id: 1, name: "Cơ bản", price: 0 },
  { id: 2, name: "Nâng cao", price: 99000 },
  { id: 3, name: "Chuyên nghiệp", price: 199000 },
];

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", plan: 1 });
  const [message, setMessage] = useState("");

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
    setMessage("Thanh toán thành công! Bạn đã trở thành thành viên.");
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, minWidth: 340 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary">
          Đăng ký thành viên
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="plan-label">Gói thành viên</InputLabel>
            <Select
              labelId="plan-label"
              name="plan"
              value={form.plan}
              label="Gói thành viên"
              onChange={handlePlanChange}
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
            color="success"
            fullWidth
            sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
          >
            Đăng ký
          </Button>
        </form>
        {message && (
          <Box mt={2}>
            <Typography color="success.main">{message}</Typography>
            {form.plan !== 1 && message.includes("thành công") && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={handlePayment}
              >
                Thanh toán
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}