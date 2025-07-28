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
import { useEffect, useState } from "react";
import api from '../../api/axios';
import "../../css/BXH.css";
import { baseApiUrl } from "../../api/axios";

const rowsPerPage = 5;

export default function BXH() {
  const [page, setPage] = useState(1);
  const [ranking, setRanking] = useState([]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchRankingWithBadges = async () => {
      try {
        const [rankingRes, badgeRes] = await Promise.all([
          api.get("/Ranking/GetAllRankings"),
          api.get("/Badge/GetAllBadge"),
        ]);
        console.log("badgeRes:", badgeRes)
        console.log("rankingRes:", rankingRes)

        const rankingData = Array.isArray(rankingRes.data) ? rankingRes.data : [];
        const badges = Array.isArray(badgeRes.data) ? badgeRes.data : [];

        const rankingWithBadges = rankingData.map((user) => {
          // Chọn huy hiệu mà điểm yêu cầu <= điểm của người dùng
          const userBadges = badges.filter(
            (badge) => badge.requiredScore <= user.score
          );
          return { ...user, badges: userBadges };
        });

        setRanking(rankingWithBadges);
      } catch (error) {
        console.error("Lỗi lấy bảng xếp hạng hoặc huy hiệu:", error);
      }
    };

    fetchRankingWithBadges();
  }, []);


  const getRankIcon = (rank) => {
    const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
    if (rank <= 3) {
      return <EmojiEventsIcon sx={{ color: colors[rank - 1] }} />;
    }
    return rank;
  };

  const paginatedData = ranking.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="bxh-container">
      <div className="bxh-title">Bảng xếp hạng thành viên</div>

      <Box component={Paper} sx={{ borderRadius: 3, boxShadow: 3, overflowX: "auto" }}>
        <Table className="bxh-table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Hạng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thành viên</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Huy hiệu</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Số ngày không hút thuốc</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData
              .sort((a, b) => b.score - a.score)
              .map((user, idx) => {
                const actualRank = (page - 1) * rowsPerPage + idx + 1;
                return (
                  <TableRow
                    key={user.rankingId || idx}
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
                    {/* Cột Hạng */}
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      {getRankIcon(actualRank)}
                    </TableCell>

                    {/* Cột Thành viên */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.userName || "Ẩn danh"
                          )}`}
                          alt={user.userName || "Ẩn danh"}
                        />
                        <Typography fontWeight={600}>
                          {user.userName || "Ẩn danh"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {user.badges?.map((badge) => (
                          <Avatar
                            key={badge.badgeId}
                            src={
                              badge.iconUrl?.startsWith("http")
                                ? badge.iconUrl
                                : `${baseApiUrl}${badge.iconUrl}`
                            }
                            alt={badge.name}
                            sx={{ width: 24, height: 24 }}
                            title={badge.name}
                          />
                        ))}
                      </Box>
                    </TableCell>

                    {/* Cột số ngày */}
                    <TableCell align="center">
                      <Typography fontWeight={500}>{user.score} ngày</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>

        </Table>
      </Box>

      {/* Pagination */}
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
