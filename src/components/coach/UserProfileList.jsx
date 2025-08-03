import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UserProfileCard from "./UserProfileCard";
import api from "../../api/axios";

export default function UserProfileList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/User/Get-All-User");
        const data = response.data;
        const memberUsers = data.filter(user => user.userType === "Member");
        setUsers(memberUsers);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    (user.displayName || user.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfileUpdate = (userId, updatedProfile) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.userId === userId 
          ? { ...user, memberProfile: updatedProfile }
          : user
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header và Search */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Danh sách thành viên ({filteredUsers.length})
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Danh sách cards */}
      {filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm ? "Không tìm thấy thành viên nào" : "Chưa có thành viên nào"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} md={6} lg={4} key={user.userId}>
              <UserProfileCard 
                user={user} 
                onProfileUpdate={(updatedProfile) => handleProfileUpdate(user.userId, updatedProfile)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
