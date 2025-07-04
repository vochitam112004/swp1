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
  Modal
} from "@mui/material";
import api from "../../api/axios";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../css/Admin.css";

export default function ManageCoach() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    displayName: "",
    phoneNumber: "",
    address: "",
  });

  const [coaches, setCoaches] = useState([]);
  const [deleteCoachId, setDeleteCoachId] = useState(null);
  const [editingCoach, setEditingCoach] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/Coach");
      if (Array.isArray(res.data)) {
        setCoaches(res.data);
      } else {
        setCoaches([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể lấy danh sách coach");
    }
  };

  const handleCreate = async () => {
    if (!form.username || !form.password || !form.email || !form.displayName) {
      toast.error("Vui lòng điền đầy đủ");
      return;
    }
    try {
      await api.post("/Coach/create-coach-by-Admin", {
        ...form,
        userType: "Coach",
      });
      toast.success("Tạo coach thành công!");
      setForm({
        username: "",
        password: "",
        email: "",
        displayName: "",
        phoneNumber: "",
        address: "",
      });
      fetchCoaches();
    } catch {
      toast.error("Lỗi khi tạo coach");
    }
  };

  const handleUpdateCoach = async (coach) => {
    try {
      await api.put(`/User/${coach.userId}`, coach);
      toast.success("Cập nhật thành công!");
      setEditingCoach(null);
      fetchCoaches();
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <Box className="manage-coach" sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Box flex={1} minWidth={300}>
        <Typography variant="h6" mb={2} className="manage-coach__title">
          Tạo tài khoản Coach
        </Typography>

        <Paper className="manage-coach__form" elevation={3} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {["username", "password", "email", "displayName", "phoneNumber", "address"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={field}
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  fullWidth
                  value={form[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCreate}>
                Tạo Coach
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box flex={1.5} minWidth={360}>
        <Typography variant="h6" mb={2}>Danh sách Coach</Typography>

        {coaches.length > 0 ? (
          <Paper elevation={2}>
            <List>
              {coaches.map((coach) => (
                <ListItem
                  key={coach.userId}
                  divider
                  secondaryAction={
                    <>
                      <IconButton onClick={() => {
                        setEditingCoach(coach);
                        setEditingData({ ...coach });
                      }}>
                        <EditIcon color="primary" />
                      </IconButton>

                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => setDeleteCoachId(coach)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={`${coach.displayName} (${coach.username})`}
                    secondary={coach.email}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Typography color="text.secondary">Chưa có coach nào.</Typography>
        )}
      </Box>

      {/* Modal chỉnh sửa */}
      <Modal
        open={Boolean(editingCoach)}
        onClose={() => {
          setEditingCoach(null);
          setEditingData(null);
        }}
      >
        <Box sx={{
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
        }}>
          <Typography variant="h6" gutterBottom>
            Cập nhật Coach: {editingData?.username}
          </Typography>

          <Grid container spacing={2}>
            {["email", "displayName", "phoneNumber", "address"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={field}
                  name={field}
                  fullWidth
                  value={editingData?.[field] || ""}
                  onChange={(e) =>
                    setEditingData({ ...editingData, [field]: e.target.value })
                  }
                />
              </Grid>
            ))}
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button variant="contained" onClick={() => handleUpdateCoach(editingData)}>
                Lưu cập nhật
              </Button>
              <Button variant="text" onClick={() => {
                setEditingCoach(null);
                setEditingData(null);
              }} sx={{ ml: 2 }}>
                Hủy
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Modal xác nhận xoá */}
      <Modal
        open={Boolean(deleteCoachId)}
        onClose={() => setDeleteCoachId(null)}
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          minWidth: 360,
        }}>
          <Typography variant="body1" color="error" mb={2}>
            Bạn có chắc chắn muốn xóa <strong>{deleteCoachId?.displayName}</strong>?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                try {
                  await api.delete(`/User/${deleteCoachId.userId}`);
                  toast.success("Đã xóa coach thành công");
                  fetchCoaches();
                } catch {
                  toast.error("Xóa coach thất bại");
                } finally {
                  setDeleteCoachId(null);
                }
              }}
            >
              Xóa
            </Button>
            <Button variant="outlined" onClick={() => setDeleteCoachId(null)}>
              Hủy
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
