import React, { useEffect, useState } from "react";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import api from "../../api/axios";

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/Coach/users-assigned");
      setUsers(res.data);
    } catch {
      console.error("Lỗi khi lấy người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Người dùng được phân công
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.userId}>
            <ListItemText
              primary={user.displayName}
              secondary={`Ngày không hút: ${user.smokeFreeDays} | Tiết kiệm: ${user.moneySaved} VNĐ`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
