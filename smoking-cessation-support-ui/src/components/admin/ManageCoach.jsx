import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import api from "../../api/axios";
import { toast } from "react-toastify";
import '../../css/Admin.css' // 👉 import file CSS

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/Admin/coach-list");
      setCoaches(res.data);
    } catch (err) {
      console.log(err)
      toast.error("Không thể lấy danh sách coach");
    }
  };

  const handleCreate = async () => {
    if (!form.username || !form.password || !form.email || !form.displayName) {
      toast.error("Vui lòng điền đầy đủ");
      return;
    }
    try {
      await api.post("/Auth/register", { ...form, userType: "coach" });
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
          {["username", "password", "email", "displayName", "phoneNumber", "address"].map(
            (field) => (
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
            )
          )}
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

      <Typography variant="h6" mb={1} className="manage-coach__title">
        Danh sách Coach
      </Typography>
      <ul className="manage-coach__list">
        {coaches.map((coach) => (
          <li key={coach.userId} className="manage-coach__item">
            <strong>{coach.displayName}</strong> ({coach.username}) - {coach.email}
          </li>
        ))}
      </ul>
    </Box>
  );
}
