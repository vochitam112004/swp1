import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import api from "../../api/axios";

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/GoalCurrentSummary");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy người dùng", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatMoney = (amount) => {
    return amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="assigned user table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell><strong>Người dùng</strong></TableCell>
            <TableCell align="center"><strong>Sức khỏe</strong></TableCell>
            <TableCell align="center"><strong>Số ngày không hút thuốc</strong></TableCell>
            <TableCell align="center"><strong>Tổng số tiền tiết kiệm</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.userId}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>{user.nameDisplay}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">{user.mood}</TableCell>
              <TableCell align="center">{user.smokeFreeDays}</TableCell>
              <TableCell align="center">{formatMoney(user.totalSpentMoney)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
