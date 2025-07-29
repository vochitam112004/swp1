import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import api from "../../api/axios";

export default function UserPlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/GoalPlan/all-goals");
        setPlans(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu kế hoạch:", err);
      }
    };
    fetchPlans();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Kế hoạch cai thuốc của người dùng
      </Typography>
      <List>
        {plans.map((p, i) => (
          <ListItem key={i} divider>
            <ListItemText
              primary={`${p.memberName} - ${p.personalMotivation}`}
              secondary={`Từ ${p.startDate} đến ${p.targetQuitDate}`}
            />
            {p.isCurrentGoal && <Chip label="Đang thực hiện" color="primary" size="small" />}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
