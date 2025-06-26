import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import api from "../../api/axios";

export default function UserPlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await api.get("/Coach/user-plans");
      setPlans(res.data);
    };
    fetchPlans();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Kế hoạch cai thuốc của người dùng</Typography>
      <List>
        {plans.map((p, i) => (
          <ListItem key={i}>
            <ListItemText
              primary={`${p.userName}: ${p.goal}`}
              secondary={`Từ ${p.startDate} đến ${p.targetDate}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}