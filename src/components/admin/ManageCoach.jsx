import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Modal,
  Grid,
  Avatar,
  Chip,
  FormControlLabel,
  Switch
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function ManageCoach() {
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [selectedCoachId, setSelectedCoachId] = useState(null);

  const [newCoach, setNewCoach] = useState({
    username: "",
    passWord: "",
    email: "",
    phoneNumber: "",
    address: "",
    userType: "Coach",
    specialization: "",
    displayName: "",
    avatarUrl: ""
  });

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/Coach");
      const data = res.data || [];
      const filtered = data
        .filter((c) => c && c.username)
        .map((c) => ({
          ...c,
          isActive: !c.isLocked,
        }));
      setCoaches(filtered);
    } catch {
      toast.error("Không thể lấy danh sách coach");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCoach = async () => {
    try {
      await api.delete(`/Coach/${selectedCoachId}`);
      toast.success("Xóa coach thành công");
      setDeleteDialogOpen(false);
      fetchCoaches();
    } catch {
      toast.error("Xóa coach thất bại");
    }
  };

  const handleUpdateCoach = async () => {
    if (!editingData || !editingData.coachId) {
      toast.error("Thiếu thông tin coach để cập nhật");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("UserName", editingData.userName || "");
      formData.append("Email", editingData.email || "");
      formData.append("PhoneNumber", editingData.phoneNumber || "");
      formData.append("Address", editingData.address || "");
      formData.append("AvatarUrl", editingData.avatarUrl || "");
      formData.append("DisplayName", editingData.displayName || "");
      formData.append("Specialization", editingData.specialization || "");
      formData.append("IsActive", editingData.isActive);
      formData.append("UpdatedAt", new Date().toISOString());

      if (editingData.avatarFile) {
        formData.append("avatarFile", editingData.avatarFile);
      }

      await api.put(`/Coach/${editingData.coachId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Cập nhật coach thành công");
      setEditModalOpen(false);
      fetchCoaches();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleCreateCoach = async () => {
    try {
      await api.post("/Coach/create-coach-by-Admin", newCoach);
      toast.success("Tạo coach thành công");
      setCreateModalOpen(false);
      fetchCoaches();
    } catch {
      toast.error("Tạo coach thất bại");
    }
  };

  const countStats = {
    total: coaches.length,
    active: coaches.filter((c) => c.isActive).length,
    locked: coaches.filter((c) => !c.isActive).length,
  };

  const fieldLabels = {
    username: "Tên đăng nhập",
    passWord: "Mật khẩu",
    email: "Email",
    phoneNumber: "Số điện thoại",
    address: "Địa chỉ",
    displayName: "Tên hiển thị",
    specialization: "Chuyên môn",
    avatarUrl: "Avatar URL",
    userName: "Tên đăng nhập"
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '80vh', px: 3, py: 2, position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          size="small"
          placeholder="Tìm theo tên coach..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
        />
        <Button variant="contained" onClick={() => setCreateModalOpen(true)} startIcon={<AddIcon />}>
          Tạo Coach
        </Button>
      </Box>

      <Box display="flex" gap={4} mb={2} bgcolor="#f5f7fa" p={2} borderRadius={2}>
        <Typography>Tổng số: <strong>{countStats.total}</strong></Typography>
        <Typography>Đang hoạt động: <strong>{countStats.active}</strong></Typography>
        <Typography>Tạm khóa: <strong>{countStats.locked}</strong></Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        {filteredCoaches.map((coach) => (
          <Box key={coach.coachId} display="flex" alignItems="center" justifyContent="space-between" p={2} borderBottom="1px solid #eee">
            <Box display="flex" alignItems="center">
              <Avatar src={coach.avatarUrl} alt={coach.displayName} sx={{ mr: 2 }} />
              <Box>
                <Typography fontWeight={600}>{coach.displayName} ({coach.username})</Typography>
                <Typography variant="body2">{coach.email}</Typography>
                <Typography variant="body2">Coach ID: {coach.username}</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={coach.isActive ? "Hoạt động" : "Tạm khóa"}
                color={coach.isActive ? "success" : "default"}
                size="small"
              />
              <IconButton onClick={() => { setEditingData(coach); setEditModalOpen(true); }}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton onClick={() => { setSelectedCoachId(coach.coachId); setDeleteDialogOpen(true); }}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Modal Edit */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#fff", p: 3, width: 500, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h6" gutterBottom>Cập nhật Coach</Typography>
          <Grid container spacing={2}>
            {["userName", "displayName", "email", "phoneNumber", "address", "specialization"].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={fieldLabels[field] || field}
                  fullWidth
                  value={editingData?.[field] || ""}
                  onChange={(e) => setEditingData({ ...editingData, [field]: e.target.value })}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={editingData?.isActive ?? true} onChange={(e) => setEditingData({ ...editingData, isActive: e.target.checked })} />}
                label="Hoạt động"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleUpdateCoach}>Lưu</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Modal Create */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, minHeight: 400, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 3, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" gutterBottom>Thêm Coach</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {["username", "passWord", "displayName", "email", "phoneNumber", "address", "specialization"].map((field) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    label={fieldLabels[field] || field}
                    fullWidth
                    value={newCoach[field]}
                    onChange={(e) => setNewCoach({ ...newCoach, [field]: e.target.value })}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mt: "auto", pt: 2, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={handleCreateCoach}>Tạo</Button>
          </Box>
        </Box>
      </Modal>

      {/* Dialog Delete */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa coach này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteCoach}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
