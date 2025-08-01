import React, { useEffect, useState } from "react";
import {
  Box, Typography, List, ListItem, ListItemText, IconButton,
  Stack, Modal, Grid, TextField, Button, FormControlLabel, Switch
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, membershipRes] = await Promise.all([
        api.get("/User/Get-All-User"),
        api.get("/UserMemberShipHistory"),
      ]);

      const users = userRes.data;
      const memberships = membershipRes.data;

      const mergedUsers = users.map((user) => {
        const userMemberships = memberships.filter(
          (m) => m.userId === user.userId
        );

        const latest = userMemberships.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        )[0];

        return {
          ...user,
          planName: latest?.planName || "Chưa mua gói",
        };
      });

      setUsers(mergedUsers);
    } catch (error) {
      console.error("Không thể lấy dữ liệu người dùng hoặc membership", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/User/${userId}`);
      setDeleteUser(null);
      toast.success("Xóa thành công!");
      fetchData();
    } catch {
      toast.error("Xóa người dùng thất bại");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("userName", editingData.userName);
      formData.append("displayName", editingData.displayName);
      formData.append("email", editingData.email);
      formData.append("phoneNumber", editingData.phoneNumber);
      formData.append("address", editingData.address);
      formData.append("isActive", editingData.isActive);

      await api.put(`/User/${editingData.userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Cập nhật thành công!");
      setEditingUser(null);
      setEditingData(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <Box sx={{ p: 3, margin: "0 auto" }}>
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
                    setEditingData({
                      ...user,
                      userName: user.userName || "",
                      isActive: user.isActive ?? true,
                    });
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
              secondary={
                <>
                  {user.email}
                  <br />
                  Gói: <strong>{user.planName}</strong>
                  <br />
                  Trạng thái: <strong>{user.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}</strong>
                </>
              }
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
            Bạn có chắc chắn muốn xóa {" "}
            <strong>{deleteUser?.displayName}</strong>?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(deleteUser.userId)}
            >
              Xóa
            </Button>
            <Button variant="outlined" onClick={() => setDeleteUser(null)}>
              Hủy
            </Button>
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: 600,
            maxWidth: "95%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Cập nhật người dùng: {editingData?.userName}
          </Typography>

          {editingData && (
            <Grid container spacing={2}>
              {["userName", "displayName", "email", "phoneNumber", "address"].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    label={field}
                    name={field}
                    fullWidth
                    value={editingData[field] || ""}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        [field]: e.target.value,
                      })
                    }
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingData.isActive}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          isActive: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Kích hoạt"
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "right" }}>
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
