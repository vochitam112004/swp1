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
} from "@mui/material";
import { useEffect, useState } from "react"
import '../../css/Blog.css'
import api from "../../api/axios";

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/User/Get-All-User")
        return response.data
      } catch (e) {
        console.error("Lỗi khi lấy người dùng", e)
      }
    }
    fetchUsers().then(data => {
      if (data) {
        const memberUsers = data.filter(user => user.userType === "Member");
        setUsers(memberUsers);
      }
    })
  }, [])

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="assigned user table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell><strong>Người dùng</strong></TableCell>
              <TableCell align="center"><strong>Địa chỉ</strong></TableCell>
              <TableCell align="center"><strong>Số điện thoại</strong></TableCell>
              <TableCell align="center"><strong>Email</strong></TableCell>
              <TableCell align="center"><strong>Trạng thái</strong></TableCell>
              <TableCell align="center"><strong>Ngày tạo</strong></TableCell>
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
                    <Typography>{user.displayName}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{user.address}</TableCell>
                <TableCell align="center">{user.phoneNumber}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.isActive ? "Đang hoạt động" : "Không còn sử dụng"}</TableCell>
                <TableCell align="center">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
