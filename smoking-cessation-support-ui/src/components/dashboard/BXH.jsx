import {
  Box,
  Typography,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useState } from "react";
import "../../css/BXH.css";

const ranking = [
  { name: "Nguyễn Thành Lợi", days: 365, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Trần Đình Phong", days: 320, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Nguyễn Thanh Liêm", days: 290, avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
  { name: "Võ Chí Tâm", days: 250, avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Nguyễn Thanh Tú", days: 210, avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Phạm Minh Tâm", days: 180, avatar: "https://randomuser.me/api/portraits/men/85.jpg" },
  { name: "Lê Thị Mai", days: 160, avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
  { name: "Trương Quốc Bảo", days: 140, avatar: "https://randomuser.me/api/portraits/men/99.jpg" },
];

const rowsPerPage = 5;

export default function BXH() {
  const [page, setPage] = useState(1);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const getRankIcon = (rank) => {
    const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
    if (rank <= 3) {
      return <EmojiEventsIcon sx={{ color: colors[rank - 1] }} />;
    }
    return rank;
  };

  // Tính dữ liệu trang hiện tại
  const paginatedData = ranking.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bxh-container">
      <div className="bxh-title">Bảng xếp hạng thành viên</div>

      <div
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflowX: "auto",
        }}
      >
        <Table className="bxh-table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Hạng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thành viên</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Số ngày không hút thuốc</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user, idx) => {
              const actualRank = (page - 1) * rowsPerPage + idx + 1;

              return (
                <TableRow
                  key={user.name}
                  className={
                    actualRank === 1
                      ? "top1"
                      : actualRank === 2
                      ? "top2"
                      : actualRank === 3
                      ? "top3"
                      : ""
                  }
                >
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    {getRankIcon(actualRank)}
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(ranking.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </div>
  );
}
