import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import "../../css/Footer.css";

export default function Methodology() {
  return (
    <div className="methodology-bg">
      <div className="methodology-container">
        <div className="methodology-title" variant="h4" gutterBottom>
          Phương pháp hỗ trợ bỏ thuốc
        </div>
        <div className="methodology-paper">
          <List className="methodology-list">
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
        </div>
      </div>
    </div>

  );
}