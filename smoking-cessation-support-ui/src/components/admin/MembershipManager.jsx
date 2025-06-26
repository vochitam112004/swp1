import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, TextField, Button } from "@mui/material";
import api from "../../api/axios";

export default function MembershipManager() {
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState("");

  const fetchPackages = async () => {
    const res = await api.get("/Membership/packages");
    setPackages(res.data);
  };

  const addPackage = async () => {
    await api.post("/Membership/create", { name });
    setName("");
    fetchPackages();
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Gói thành viên</Typography>
      <TextField
        label="Tên gói"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button variant="contained" onClick={addPackage}>Thêm</Button>
      <List>
        {packages.map((pkg) => (
          <ListItem key={pkg.id}>{pkg.name}</ListItem>
        ))}
      </List>
    </Box>
  );
}
