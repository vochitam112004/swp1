import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { toast } from "react-toastify";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Liên hệ với chúng tôi</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Tên" name="name" value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Nội dung"
            name="message"
            value={form.message}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit">Gửi</Button>
        </form>
      </Paper>
    </Box>
  );
}
