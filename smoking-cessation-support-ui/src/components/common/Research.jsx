import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function Research() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Nghiên cứu & Tài liệu</Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6">Hiệu quả của hỗ trợ kỹ thuật số trong cai thuốc</Typography>
        <Typography color="text.secondary" variant="body2" gutterBottom>J. Smith et al., 2023</Typography>
        <Typography>Ứng dụng đã giúp tăng gấp đôi tỷ lệ bỏ thuốc trong vòng 12 tuần.</Typography>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Tâm lý học hành vi trong hỗ trợ cai thuốc</Typography>
        <Typography color="text.secondary" variant="body2" gutterBottom>Nguyễn Văn Dũng, 2022</Typography>
        <Typography>Kỹ thuật CBT giúp người dùng vượt qua cơn thèm thuốc và duy trì động lực.</Typography>
      </Paper>
    </Box>
  );
}
