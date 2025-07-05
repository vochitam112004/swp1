import React, { useEffect, useState } from "react";
import {
  Box, Typography, List, ListItem, ListItemText, IconButton,
  Stack, Modal, Grid, TextField, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/User/Get-All-User");
      setUsers(res.data);
    } catch {
      console.error("Không lấy được danh sách người dùng");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/User/${userId}`);
      setDeleteUser(null);
      toast.success("Xóa thành công!");
      fetchUsers();
    } catch {
      toast.error("Xóa người dùng thất bại");
    }
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/User/${editingData.userId}`, editingData);
      toast.success("Cập nhật thành công!");
      setEditingUser(null);
      setEditingData(null);
      fetchUsers();
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
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
                  aria-label="edit"
                  onClick={() => {
                    setEditingUser(user);
                    setEditingData({ ...user });
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => setDeleteUser(user)}
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

      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 360,
          }}
        >
          <Typography variant="body1" color="error" mb={2}>
            Bạn có chắc chắn muốn xóa <strong>{deleteUser?.displayName}</strong>?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="error" onClick={() => handleDelete(deleteUser.userId)}>Xóa</Button>
            <Button variant="outlined" onClick={() => setDeleteUser(null)}>Hủy</Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={Boolean(editingUser)}
        onClose={() => {
          setEditingUser(null);
          setEditingData(null);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: 600,
            maxWidth: '95%',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Cập nhật người dùng: {editingData?.username}
          </Typography>

          {editingData && (
            <Grid container spacing={2}>
              {["displayName", "email", "phoneNumber", "address"].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    label={field}
                    name={field}
                    fullWidth
                    value={editingData[field] || ""}
                    onChange={(e) =>
                      setEditingData({ ...editingData, [field]: e.target.value })
                    }
                  />
                </Grid>
              ))}

              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button variant="contained" onClick={handleUpdateUser}>
                  Lưu cập nhật
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setEditingUser(null);
                    setEditingData(null);
                  }}
                  sx={{ ml: 2 }}
                >
                  Hủy
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
