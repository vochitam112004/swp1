import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import api from "../../api/axios";

export default function SendAdvice() {
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    await api.post("/Coach/send-advice", { to: target, message });
    setMessage("");
  };

  return (
    <Box>
      <Typography variant="h6">Gửi tư vấn cá nhân</Typography>
      <TextField label="Tên người dùng" fullWidth value={target} onChange={(e) => setTarget(e.target.value)} sx={{ my: 2 }} />
      <TextField label="Nội dung tư vấn" fullWidth multiline rows={4} value={message} onChange={(e) => setMessage(e.target.value)} sx={{ my: 2 }} />
      <Button variant="contained" onClick={handleSend}>Gửi</Button>
    </Box>
  );
}