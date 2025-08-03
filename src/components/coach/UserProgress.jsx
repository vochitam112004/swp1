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
        // Step 1: Fetch all users
        const res = await api.get("/User/Get-All-User");
        const userList = res.data.filter((u) => u.userType === "Member");

        // Step 2: Fetch profile for each user individually.
        // Note: This creates an N+1 query problem. For better performance,
        // the backend API should ideally provide an endpoint that returns users with their profiles already joined.
        const profiles = await Promise.all(
          userList.map(async (user) => {
            try {
              const profileRes = await api.get(`/MemberProfile/GetMemberProfileByUserId/${user.userId}`);
              return {
                ...user,
                ...profileRes.data, // Spread profile data directly
              };
            } catch (e) {
              console.warn(`Could not find profile for userId ${user.userId}.`);
              // Return user with empty profile fields to prevent crashes
              return { 
                ...user, 
                health: null,
                quitAttempts: null, 
                cigarettesSmoked: null,
                experienceLevel: null,
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

  // This calculates the total money NOT spent during past quit attempts.
  const calculateSavings = (user) => {
    if (user.pricePerPack && user.cigarettesPerPack && user.cigarettesSmoked && user.quitAttempts) {
      const pricePerCigarette = user.pricePerPack / user.cigarettesPerPack;
      return user.quitAttempts * user.cigarettesSmoked * pricePerCigarette;
    }
    return 0;
  };

  const filteredUsers = users.filter((user) =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Common styles for Paper components for consistency (DRY principle)
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
              <TableCell align="center">Tiền tiết kiệm ước tính</TableCell>
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
                    sx={{ fontWeight: 'medium', color: calculateSavings(user) > 0 ? 'success.main' : 'text.secondary' }}
                  >
                    {formatMoney(calculateSavings(user))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                   <Box display="flex" flexDirection="column" alignItems="center" p={4} gap={2}>
                      <PersonSearchOffIcon color="action" sx={{ fontSize: 40 }} />
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