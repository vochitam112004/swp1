import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, CircularProgress, TextField, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/axios";

export default function UserProgress() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/User/Get-All-User");
        const userList = res.data.filter((u) => u.userType === "Member");

        const profiles = await Promise.all(
          userList.map(async (user) => {
            try {
              const [profileRes, goalRes] = await Promise.all([
                api.get(`/MemberProfile/GetMemberProfileByUserId/${user.userId}`),
                api.get(`/CurrentGoal?userId=${user.userId}`),
              ]);

              return {
                ...user,
                ...profileRes.data,
                totalMoneySaved: goalRes.data.totalMoneySaved ?? 0,
              };
            } catch (e) {
              console.warn(`Could not fetch data for userId ${user.userId}.`, e);

              let profile = {};
              try {
                const profileRes = await api.get(`/MemberProfile/GetMemberProfileByUserId/${user.userId}`);
                profile = profileRes.data;
              } catch {
                // leave profile fields as null if fail
                profile = {
                  health: null,
                  quitAttempts: null,
                  cigarettesSmoked: null,
                  experienceLevel: null,
                };
              }

              return {
                ...user,
                ...profile,
                totalMoneySaved: 0,
              };
            }
          })
        );

        setUsers(profiles);
      } catch (error) {
        console.error("Error fetching the user list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatMoney = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return "0 ₫";
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const filteredUsers = users.filter((user) =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paperStyles = {
    p: 2,
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <TableContainer component={Paper} sx={paperStyles}>
        <TextField
          variant="outlined"
          label="Tìm kiếm người dùng theo tên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Table sx={{ minWidth: 800 }} aria-label="assigned user table">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 'bold', backgroundColor: 'action.hover' } }}>
              <TableCell>Người dùng</TableCell>
              <TableCell align="center">Tình trạng sức khỏe</TableCell>
              <TableCell align="center">Lần thử cai</TableCell>
              <TableCell align="center">Số năm hút thuốc</TableCell>
              <TableCell align="center">Số điếu / ngày</TableCell>
              <TableCell align="center">Tiền tiết kiệm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.userId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {user.displayName}
                  </TableCell>
                  <TableCell align="center">{user.health || "—"}</TableCell>
                  <TableCell align="center">
                    {user.quitAttempts != null ? `${user.quitAttempts} lần` : "—"}
                  </TableCell>
                  <TableCell align="center">
                    {user.experienceLevel != null ? `${user.experienceLevel} năm` : "—"}
                  </TableCell>
                  <TableCell align="center">
                    {user.cigarettesSmoked != null ? `${user.cigarettesSmoked} điếu` : "—"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'medium',
                      color: user.totalMoneySaved > 0 ? 'success.main' : 'text.secondary',
                    }}
                  >
                    {formatMoney(user.totalMoneySaved)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy người dùng nào khớp với tìm kiếm của bạn.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
