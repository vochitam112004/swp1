import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, IconButton,
  Stack, Modal, Grid, FormControlLabel, Switch,
  Avatar, Chip, InputAdornment
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
          isActive: user.isActive === true || user.isActive === "true",
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

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '80vh', px: 3, py: 2 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Tìm theo tên..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {/* Stats */}
      <Box sx={{ mb: 2, bgcolor: '#f8f9fa', py: 1, px: 2, borderRadius: 1 }}>
        <Stack direction="row" spacing={4}>
          <Typography variant="body2">
            Tổng số: <strong>{users.length}</strong>
          </Typography>
          <Typography variant="body2">
            Đang hoạt động: <strong>{users.filter(u => u.isActive).length}</strong>
          </Typography>
          <Typography variant="body2">
            Tạm khóa: <strong>{users.filter(u => !u.isActive).length}</strong>
          </Typography>
        </Stack>
      </Box>

      {/* User List */}
      {filteredUsers.map((user, index) => (
        <Box
          key={user.userId}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            px: 2,
            borderBottom: index < filteredUsers.length - 1 ? '1px solid #e0e0e0' : 'none',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          <Avatar
            src={user.avatarUrl || undefined}
            alt={user.displayName}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight="medium">{user.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Gói: {user.planName}
              </Typography>
              <Chip
                label={user.isActive ? "Hoạt động" : "Tạm khóa"}
                color={user.isActive ? "success" : "error"}
                size="small"
              />
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => {
                setEditingUser(user);
                setEditingData({
                  ...user,
                  userName: user.userName || "",
                  isActive: user.isActive ?? true,
                });
              }}
              sx={{ color: '#1976d2' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteUser(user)}
              sx={{ color: '#f44336' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ))}

      {/* No users found */}
      {filteredUsers.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy người dùng
          </Typography>
        </Box>
      )}

      {/* Delete Modal */}
      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            p: 3, borderRadius: 2,
            boxShadow: 24, minWidth: 360,
          }}
        >
          <Typography variant="body1" color="error" mb={2}>
            Bạn có chắc chắn muốn xóa <strong>{deleteUser?.displayName}</strong>?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="error" onClick={() => handleDelete(deleteUser.userId)}>
              Xóa
            </Button>
            <Button variant="outlined" onClick={() => setDeleteUser(null)}>
              Hủy
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Modal */}
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
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24, borderRadius: 2,
            p: 4, width: 600, maxWidth: "95%",
          }}
        >
          <Typography variant="h5" mb={3}>
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
                  label={editingData.isActive ? "Đang hoạt động" : "Tạm khóa"}
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
