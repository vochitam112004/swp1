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

  const [editingCoach, setEditingCoach] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/Coach");
      console.log("👉 Response from /Coach:", res.data);
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

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa coach này?");
    if (!confirmed) return;

    try {
      await api.delete(`/User/${userId}`);
      toast.success("Đã xóa coach thành công");
      fetchCoaches();
    } catch {
      toast.error("Xóa coach thất bại");
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
    <Box className="manage-coach">
      <Typography variant="h6" mb={2} className="manage-coach__title">
        Tạo tài khoản Coach
      </Typography>

      <Paper className="manage-coach__form" elevation={3}>
        <Grid container spacing={2}>
          {[
            "username",
            "password",
            "email",
            "displayName",
            "phoneNumber",
            "address",
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                fullWidth
                value={form[field]}
                onChange={handleChange}
                className="manage-coach__input"
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleCreate}
              className="manage-coach__button"
            >
              Tạo Coach
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" mt={4} mb={1} className="manage-coach__title">
        Danh sách Coach
      </Typography>

      {Array.isArray(coaches) && coaches.length > 0 ? (
        <List>
          {coaches.map((coach) => (
            <ListItem
              key={coach.userId}
              secondaryAction={
                <>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingCoach(coach);
                      setEditingData({ ...coach }); // clone dữ liệu để chỉnh riêng
                    }}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon color="primary" />
                  </Button>

                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(coach.userId)}
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
      ) : (
        <Typography color="text.secondary">Chưa có coach nào.</Typography>
      )}
      <Modal
        open={Boolean(editingCoach)}
        onClose={() => {
          setEditingCoach(null);
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
            Cập nhật Coach: {editingData?.username}
          </Typography>

          {editingData && (
            <Grid container spacing={2}>
              {["email", "displayName", "phoneNumber", "address"].map((field) => (
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
                <Button
                  variant="contained"
                  onClick={() => handleUpdateCoach(editingData)}
                >
                  Lưu cập nhật
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setEditingCoach(null);
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
