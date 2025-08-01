import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Modal,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "../../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

export default function ManageCoach() {
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [editingData, setEditingData] = useState(null);
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
      const processed = (res.data || [])
        .filter((c) => c && c.username)
        .map((c) => ({
          ...c,
          isActive: !c.isLocked,
          userName: c.username,
          avatarUrl: c.avatarUrl || null,
        }));
      setCoaches(processed);
    } catch (error) {
      console.error("Failed to fetch coaches", error);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleDeleteCoach = async () => {
    try {
      await api.delete(`/Coach/${selectedCoachId}`);
      toast.success("Xóa coach thành công");
      setDeleteDialogOpen(false);
      fetchCoaches();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Xóa coach thất bại");
    }
  };

  const handleUpdateCoach = async () => {
    if (!editingData) return;

    try {
      const formData = new FormData();
      formData.append("UserName", editingData.userName);
      formData.append("Email", editingData.email);
      formData.append("PhoneNumber", editingData.phoneNumber);
      formData.append("Address", editingData.address);
      formData.append("AvatarUrl", editingData.avatarUrl);
      formData.append("DisplayName", editingData.displayName);
      formData.append("Specialization", editingData.specialization);
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
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Cập nhật thất bại");
    }
  };

  const handleCreateCoach = async () => {
    try {
      await api.post("/Coach/create-coach-by-Admin", newCoach);
      toast.success("Tạo coach thành công");
      setCreateModalOpen(false);
      fetchCoaches();
      setNewCoach({
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
    } catch (error) {
      console.error("Create failed:", error);
      toast.error("Tạo coach thất bại");
    }
  };

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quản lý Coach
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Tìm kiếm coach"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm Coach
        </Button>
      </Box>

      <List>
        {filteredCoaches.map((coach) => (
          <ListItem key={coach.coachId} secondaryAction={
            <>
              <IconButton onClick={() => {
                setEditingData(coach);
                setEditModalOpen(true);
              }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => {
                setSelectedCoachId(coach.coachId);
                setDeleteDialogOpen(true);
              }}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <Avatar src={coach.avatarUrl} sx={{ mr: 2 }} />
            <ListItemText
              primary={coach.displayName}
              secondary={`${coach.email} - ${coach.specialization}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Modal edit coach */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box p={3} sx={{ backgroundColor: "white", width: 500, mx: "auto", mt: 5 }}>
          <Typography variant="h6" gutterBottom>Cập nhật Coach</Typography>
          {editingData && (
            <Grid container spacing={2}>
              {["userName", "displayName", "email", "phoneNumber", "address", "specialization"].map((field) => (
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
              <Grid item xs={12} sm={6}>
                <Button variant="contained" component="label">
                  Upload Avatar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      setEditingData({ ...editingData, avatarFile: e.target.files[0] })
                    }
                  />
                </Button>
                {editingData.avatarFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {editingData.avatarFile.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleUpdateCoach}>Lưu</Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* Modal create coach */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <Box p={3} sx={{ backgroundColor: "white", width: 500, mx: "auto", mt: 5 }}>
          <Typography variant="h6" gutterBottom>Thêm Coach</Typography>
          <Grid container spacing={2}>
            {["username", "passWord", "displayName", "email", "phoneNumber", "address", "specialization", "avatarUrl"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={field}
                  name={field}
                  fullWidth
                  value={newCoach[field] || ""}
                  onChange={(e) =>
                    setNewCoach({ ...newCoach, [field]: e.target.value })
                  }
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCreateCoach}>Tạo</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Dialog xóa */}
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
