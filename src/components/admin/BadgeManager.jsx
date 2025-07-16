import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function BadgeManager() {
  const [badges, setBadges] = useState([]);
  const [editBadge, setEditBadge] = useState(null);
  const [form, setForm] = useState({
    name: "",
    iconUrl: "",
    description: "",
    requiredScore: 0,
  });
  const [open, setOpen] = useState(false);

  const fetchBadges = async () => {
    const res = await api.get("/Badge/GetAllBadge");
    setBadges(res.data);
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleEdit = (badge) => {
    setEditBadge(badge);
    setForm({
      name: badge.name,
      iconUrl: badge.iconUrl,
      description: badge.description,
      requiredScore: badge.requiredScore,
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "requiredScore" ? parseInt(value) : value,
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.iconUrl.trim()) return;
    if (editBadge) {
      await api.put(`/Badge/Update-BadgeByBadgeId/${editBadge.badgeId}`, form);
    } else {
      await api.post("/Badge/Create-Badge", form);
    }
    setOpen(false);
    setEditBadge(null);
    setForm({ name: "", iconUrl: "", description: "", requiredScore: 0 });
    fetchBadges();
  };

  const handleAdd = () => {
    setEditBadge(null);
    setForm({ name: "", iconUrl: "", description: "", requiredScore: 0 });
    setOpen(true);
  };

  const handleDelete = async (badgeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá huy hiệu này?")) return;
    try {
      await api.delete(`/Badge/Delete-BadgeByBadgeId/${badgeId}`);
      toast.success("Đã xoá huy hiệu!");
      fetchBadges();
    } catch {
      toast.error("Xoá thất bại!");
    }
  };

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Typography variant="h6">Danh sách huy hiệu</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Thêm huy hiệu
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Biểu tượng</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Điểm yêu cầu</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {badges.map((badge) => (
              <TableRow key={badge.badgeId}>
                <TableCell>
                  <img
                    src={badge.iconUrl}
                    alt={badge.name}
                    style={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell>{badge.name}</TableCell>
                <TableCell>{badge.description}</TableCell>
                <TableCell>{badge.requiredScore}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(badge)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(badge.badgeId)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editBadge ? "Chỉnh sửa huy hiệu" : "Thêm huy hiệu"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên huy hiệu"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="URL hình ảnh huy hiệu"
            name="iconUrl"
            value={form.iconUrl}
            onChange={handleChange}
            fullWidth
            required
            placeholder="vd: https://..."
          />
          <TextField
            margin="dense"
            label="Mô tả"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            margin="dense"
            label="Điểm yêu cầu"
            name="requiredScore"
            type="number"
            value={form.requiredScore}
            onChange={handleChange}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            {editBadge ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
