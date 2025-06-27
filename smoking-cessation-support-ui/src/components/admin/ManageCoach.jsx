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

export default function ManageCoach() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    displayName: "",
    phoneNumber: "",
    address:""
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
      setForm({ username: "", password: "", email: "", displayName: "", phoneNumber: "", address: "" });
      fetchCoaches();
    } catch {
      toast.error("Lỗi khi tạo coach");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={2}>Tạo tài khoản Coach</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
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

      <Typography variant="h6" mb={1}>Danh sách Coach</Typography>
      <ul>
        {coaches.map((coach) => (
          <li key={coach.userId}>
            {coach.displayName} ({coach.username}) - {coach.email}
          </li>
        ))}
      </ul>
    </Box>
  );
}
