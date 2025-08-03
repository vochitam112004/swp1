import {
  Box,
  Typography,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Stack
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import ChatSupport from "../chat/ChatSupport"; // đảm bảo import đúng path

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // user đang chat
  const [showChat, setShowChat] = useState(false); // hiển thị khung chat

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/User/Get-All-User");
        const data = response.data;
        const memberUsers = data.filter(user => user.userType === "Member");
        setUsers(memberUsers);
      } catch (e) {
        console.error("Lỗi khi lấy người dùng", e);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (user) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  const closeChat = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '80vh', px: 3, py: 2, position: 'relative' }}>
      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Tìm theo tên..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <Box sx={{ mb: 2, bgcolor: '#f8f9fa', py: 1, px: 2, borderRadius: 1 }}>
        <Stack direction="row" spacing={4}>
          <Typography variant="body2">
            Tổng số: <strong>{users.length}</strong>
          </Typography>
          <Typography variant="body2">
            Đang hoạt động: <strong>{users.filter(u => u.isActive).length}</strong>
          </Typography>
          <Typography variant="body2">
            Tạm khóa: <strong>{users.filter(u => !u.isActive).length}</strong>
          </Typography>
        </Stack>
      </Box>

      {/* User List */}
      {filteredUsers.map((user, index) => (
        <Box
          key={user.userId}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            px: 2,
            borderBottom: index < filteredUsers.length - 1 ? '1px solid #e0e0e0' : 'none',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          <Avatar
            src={user.avatarUrl || undefined}
            alt={user.displayName}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight="medium">{user.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            <Typography variant="body2" color="text.secondary">Địa chỉ: {user.address}</Typography>
            <Typography variant="body2" color="text.secondary">SĐT: {user.phoneNumber}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }} alignItems="center">
              <Chip
                label={user.isActive ? "Hoạt động" : "Tạm khóa"}
                color={user.isActive ? "success" : "error"}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Ngày tạo: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </Typography>
            </Stack>
          </Box>

          {/* Chat Icon */}
          <IconButton
            onClick={() => handleChatClick(user)}
            color="primary"
            sx={{ ml: 2 }}
          >
            <ChatIcon />
          </IconButton>
        </Box>
      ))}

      {/* No users found */}
      {filteredUsers.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy người dùng
          </Typography>
        </Box>
      )}

      {/* ChatSupport hiển thị khi showChat = true */}
      {showChat && selectedUser && (
        <ChatSupport
          targetUserId={selectedUser.userId}
          targetDisplayName={selectedUser.displayName}
          onClose={closeChat}
        />
      )}
    </Box>
  );
}
