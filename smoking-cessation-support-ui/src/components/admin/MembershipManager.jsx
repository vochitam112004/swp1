import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, TextField, Button } from "@mui/material";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function MembershipManager() {
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const fetchPackages = async () => {
    const res = await api.get("/MembershipPlan");
    setPackages(res.data);
  };

  const addPackage = async () => {
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

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Box display="flex" gap={4} alignItems="flex-start">
      <Box flex={1}>
        <Typography variant="h6">Thêm gói thành viên</Typography>
        <TextField
          label="Tên gói"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ my: 1 }}
          fullWidth
        />
        <TextField
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ my: 1 }}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Số ngày"
          value={durationDays}
          onChange={(e) => setDurationDays(Number(e.target.value))}
          sx={{ my: 1 }}
          fullWidth
        />
        <TextField
          label="Giá (VND)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          sx={{ my: 1 }}
          fullWidth
        />
        <Button variant="contained" onClick={addPackage} sx={{ mt: 2 }}>
          Thêm
        </Button>
      </Box>

      <Box flex={2}>
        <Typography variant="h6" mb={1}>Danh sách gói</Typography>
        <List>
          {packages.map((pkg) => (
            <ListItem key={pkg.planId} divider>
              <div>
                <Typography variant="h6">{pkg.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Thời gian: {pkg.durationDays} ngày – Giá: {pkg.price} VND
                </Typography>
                <Typography variant="body2">{pkg.description}</Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>

  );
}
