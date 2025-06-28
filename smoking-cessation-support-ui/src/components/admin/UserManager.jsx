import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import api from "../../api/axios";

export default function UserManager() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/Admin/user-list");
      setUsers(res.data);
    } catch {
      console.error("Không lấy được danh sách người dùng");
    }
  };

  const handleBan = async (id) => {
    await api.patch(`/Admin/ban-user/${id}`);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
    if (!confirmed) return;

    try {
      await api.delete(`/Admin/delete-user/${id}`);
      fetchUsers();
    } catch {
      console.error("Xóa người dùng thất bại");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

   return (
    <Box>
      <Typography variant="h6" mb={2}>
        Quản lý người dùng
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.userId}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleBan(user.userId)}
                >
                  Ban
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleDelete(user.userId)}
                >
                  Xóa
                </Button>
              </Stack>
            }
          >
            <ListItemText
              primary={user.displayName}
              secondary={user.email}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}