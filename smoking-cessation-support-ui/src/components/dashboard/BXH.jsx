import {
  Box,
  Typography,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const ranking = [
  {
    name: "Nguyễn Thành Lợi",
    days: 365,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Trần Đình Phong",
    days: 320,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Nguyễn Thanh Liêm",
    days: 290,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Võ Chí Tâm",
    days: 250,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Nguyễn Thanh Tú",
    days: 210,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export default function BXH() {
  const getRankIcon = (rank) => {
    const colors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // vàng, bạc, đồng
    if (rank <= 3) {
      return <EmojiEventsIcon sx={{ color: colors[rank - 1] }} />;
    }
    return rank;
  };

  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 720, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="primary"
        mb={4}
        textAlign="center"
      >
        Bảng xếp hạng thành viên
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Hạng
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thành viên</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Số ngày không hút thuốc
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((user, idx) => (
              <TableRow key={user.name}>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  {getRankIcon(idx + 1)}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar src={user.avatar} alt={user.name} />
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
