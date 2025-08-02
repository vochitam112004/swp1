import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, IconButton,
  Grid, Paper, Tooltip, Modal, Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import api from "../../api/axios";

const style = {
  modalBox: {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  }
};

const formatPrice = (price) => price?.toLocaleString("vi-VN") + " VND";

const MembershipManager = () => {
  const [plans, setPlans] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", durationDays: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/MembershipPlan");
      setPlans(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenModal = (plan = null) => {
    setEditingId(plan?.planId || null);
    setFormData(plan || { name: "", description: "", price: "", durationDays: "" });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({ name: "", description: "", price: "", durationDays: "" });
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        price: parseInt(formData.price),
        durationDays: parseInt(formData.durationDays)
      };
      if (editingId) {
        await api.put(`/MembershipPlan/${editingId}`, data);
      } else {
        await api.post("/MembershipPlan", data);
      }
      fetchPlans();
      handleCloseModal();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/MembershipPlan/${deleteConfirm.planId}`);
      fetchPlans();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={600}>Quản lý gói thành viên</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()} sx={{ borderRadius: 2 }}>
          Thêm gói
        </Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map((pkg) => (
          <Grid item xs={12} md={6} lg={4} key={pkg.planId}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" fontWeight={600}>{pkg.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {pkg.durationDays} ngày – {formatPrice(pkg.price)}
                  </Typography>
                  <Typography variant="body2" mt={1}>{pkg.description}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton onClick={() => handleOpenModal(pkg)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => setDeleteConfirm(pkg)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal Thêm / Sửa */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={style.modalBox}>
          <Typography variant="h6" mb={2} fontWeight={600}>
            {editingId ? "Chỉnh sửa gói" : "Thêm gói mới"}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Tên gói"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              minRows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="Giá"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <TextField
              label="Số ngày"
              type="number"
              fullWidth
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
            />
            <Button variant="contained" fullWidth sx={{ borderRadius: 2 }} onClick={handleSave}>
              {editingId ? "Lưu thay đổi" : "Thêm"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <Box sx={style.modalBox}>
          <Typography variant="h6" mb={2} fontWeight={600}>Xác nhận xóa</Typography>
          <Typography mb={3}>
            Bạn có chắc muốn xóa gói "<strong>{deleteConfirm?.name}</strong>" không?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setDeleteConfirm(null)}>Hủy</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>Xóa</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default MembershipManager;
