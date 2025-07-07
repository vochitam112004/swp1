import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import api from "../../api/axios";

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/CurrentGoal/current-goal");
      setUsers([res.data]);
    } catch (error) {
      console.error("Lỗi khi lấy người dùng", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Người dùng được giao
      </Typography>
      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={user.memberDisplayName}
              secondary={`Ngày không hút: ${user.smokeFreeDays} 
              | Tiết kiệm: ${user.totalSpenMoney} VNĐ`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
