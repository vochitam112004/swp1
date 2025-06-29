import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function Methodology() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Phương pháp hỗ trợ bỏ thuốc</Typography>
      <List>
        <ListItem>
          <ListItemText primary="🌱 Kế hoạch cá nhân hóa theo từng người dùng" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🧠 Kỹ thuật hành vi và CBT" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🤝 Hỗ trợ từ huấn luyện viên chuyên nghiệp" />
        </ListItem>
        <ListItem>
          <ListItemText primary="📊 Theo dõi tiến trình và động viên liên tục" />
        </ListItem>
      </List>
    </Box>
  );
}
