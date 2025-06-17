import { Box, Typography, Paper, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const ranking = [
  {
    name: "Nguyễn Thành Lợi",
    days: 365,
    avatar: "https://randomuaser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Trần Đình Phong",
    days: 320,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Nguyễn Thanh Liêm",
    days: 290,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  {
    name: "Võ Chí Tâm",
    days: 250,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Nguyễn Thanh Tú",
    days: 210,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

export default function BXH() {
  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h3" fontWeight={700} color="primary" mb={4} textAlign="center">
        TEST BXH
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Hạng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thành viên</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Số ngày không hút thuốc</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((user, idx) => (
              <TableRow key={user.name}>
                <TableCell align="center" sx={{ fontWeight: 700, color: idx === 0 ? "goldenrod" : "inherit" }}>
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar src={user.avatar} />
                    <Typography fontWeight={600}>{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography fontWeight={500}>{user.days} ngày</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}