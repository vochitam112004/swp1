import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, IconButton, Stack } from "@mui/material";
import api from "../../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UserManager() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/User/Get-All-User");
      console.log(res.data)
      setUsers(res.data);
    } catch {
      console.error("Không lấy được danh sách người dùng");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
    if (!confirmed) return;

    try {
      await api.delete(`/User/${id}`);
      fetchUsers();
    } catch {
      console.error("Xóa người dùng thất bại");
    }
  };

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
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(user.userId)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
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