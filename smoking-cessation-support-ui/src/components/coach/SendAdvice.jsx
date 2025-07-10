import { useEffect, useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import api from "../../api/axios";
import ChatSupport from "../chat/ChatSupport";

export default function SendAdvice() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/User/Get-All-User");
        setUsers(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách người dùng", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChat = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseChat = () => {
    setSelectedUserId(null);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell><strong>Người dùng</strong></TableCell>
              <TableCell align="left"><strong>Email</strong></TableCell>
              <TableCell align="center"><strong>Nhắn tin</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId} hover>
                <TableCell>{user.displayName}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="center">
                  <ChatIcon
                    sx={{ cursor: 'pointer', color: '#1976d2' }}
                    onClick={() => handleChat(user.userId)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUserId && (
        <ChatSupport targetUserId={selectedUserId} onClose={handleCloseChat}/>
      )}
    </Box>
  );
}
