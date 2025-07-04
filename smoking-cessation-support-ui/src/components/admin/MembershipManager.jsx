import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  IconButton,
  Modal,
  Grid
} from "@mui/material";
import api from "../../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

export default function MembershipManager() {
  const [packages, setPackages] = useState([]);
  const [deletePackage, setDeletePackage] = useState(null);
  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const fetchPackages = async () => {
    const res = await api.get("/MembershipPlan");
    setPackages(res.data);
  };

  const addPackage = async () => {
    if (!name || durationDays <= 0 || price <= 0) {
      toast.error("Vui lòng điền đầy đủ thông tin gói.");
      return;
    }
    if (packages.some((pkg) => pkg.name === name)) {
      toast.error("Tên gói đã tồn tại.");
      return;
    }
    try {
      await api.post("/MembershipPlan", { name, durationDays, price, description });
      setName("");
      setDurationDays(0);
      setPrice(0);
      setDescription("");
      fetchPackages();
      toast.success("Thêm gói thành công!");
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Thêm gói thất bại. Vui lòng thử lại.");
    }
  };

  const deletePackageById = async (planId) => {
    try {
      await api.delete(`/MembershipPlan/${planId}`);
      setDeletePackage(null);
      fetchPackages();
      toast.success("Xóa gói thành công!");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Xóa gói thất bại. Vui lòng thử lại.");
    }
  };

  const handleUpdateMembership = async (planId) => {
    try {
      await api.put(`/MembershipPlan/${planId}`, editingData);
      toast.success("Cập nhật thành công!");
      setEditingPackage(null);
      fetchPackages();
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Box display="flex" gap={4} alignItems="flex-start">
      <Box flex={1}>
        <Typography variant="h6">Thêm gói thành viên</Typography>
        <TextField label="Tên gói" value={name} onChange={(e) => setName(e.target.value)} sx={{ my: 1 }} fullWidth />
        <TextField label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ my: 1 }} multiline rows={3} fullWidth />
        <TextField label="Số ngày" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} sx={{ my: 1 }} fullWidth />
        <TextField label="Giá (VND)" value={price} onChange={(e) => setPrice(Number(e.target.value))} sx={{ my: 1 }} fullWidth />
        <Button variant="contained" onClick={addPackage} sx={{ mt: 2 }}>
          Thêm
        </Button>
      </Box>

      <Box flex={2}>
        <Typography variant="h6" mb={1}>Danh sách gói</Typography>
        <List>
          {packages.map((pkg) => (
            <ListItem key={pkg.planId} divider sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="h6">{pkg.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Thời gian: {pkg.durationDays} ngày – Giá: {pkg.price} VND
                </Typography>
                <Typography variant="body2">{pkg.description}</Typography>
              </Box>

              <Box>
                <IconButton onClick={() => { 
                  setEditingPackage(pkg.planId); 
                  setEditingData({ ...pkg }); }}>
                  <EditIcon color="primary" />
                </IconButton>

                <IconButton 
                  color="error" 
                  onClick={() => setDeletePackage(pkg)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Modal open={!!deletePackage} onClose={() => setDeletePackage(null)}>
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
            Bạn có chắc chắn muốn xóa gói <strong>{deletePackage?.name}</strong>?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="error" onClick={() => deletePackageById(deletePackage.planId)}>Xóa</Button>
            <Button variant="outlined" onClick={() => setDeletePackage(null)}>Hủy</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={!!editingPackage} onClose={() => { setEditingPackage(null); setEditingData(null); }}>
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
            width: 500,
            maxWidth: '95%',
          }}
        >
          <Typography variant="h6" gutterBottom>Cập nhật gói: {editingData?.name}</Typography>
          {editingData && (
            <Grid container spacing={2}>
              {["name", "description", "durationDays", "price"].map((field) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    label={field}
                    name={field}
                    type={field === "durationDays" || field === "price" ? "number" : "text"}
                    fullWidth
                    value={editingData[field] || ""}
                    onChange={(e) => setEditingData({ ...editingData, [field]: e.target.value })}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button variant="contained" onClick={() => handleUpdateMembership(editingPackage)}>Lưu</Button>
                <Button variant="text" onClick={() => { setEditingPackage(null); setEditingData(null); }} sx={{ ml: 2 }}>Hủy</Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
