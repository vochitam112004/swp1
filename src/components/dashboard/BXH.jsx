import {
  Box,
  Typography,
  Paper,
  Avatar,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from '../../api/axios';
import "../../css/BXH.css";

export default function BXH() {
  const [ranking, setRanking] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const rankingRes = await api.get("/Ranking/GetAllRankings");
        console.log("rankingRes:", rankingRes)

        const rankingData = Array.isArray(rankingRes.data) ? rankingRes.data : [];
        
        // Sắp xếp theo score giảm dần
        const sortedRanking = rankingData.sort((a, b) => b.score - a.score);
        setRanking(sortedRanking);
      } catch (error) {
        console.error("Lỗi lấy bảng xếp hạng:", error);
      }
    };

    fetchRanking();
  }, []);

  // Lấy top 3 và danh sách còn lại
  const top3 = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3);

  // Tính toán số tiền tiết kiệm (giả sử 1 gói thuốc = 50,000 VND)
  const calculateSavings = (days) => {
    const pricePerPack = 50000;
    const packsPerDay = 1; // Giả sử 1 gói/ngày
    return days * packsPerDay * pricePerPack;
  };

  // Format số tiền
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="bxh-container">
      {/* Header */}
      <div className="bxh-header">
        <Typography variant="h4" className="bxh-title">
          Bảng xếp hạng cộng đồng
        </Typography>
        <Typography variant="body1" className="bxh-subtitle">
          Xem thứ hạng của bạn và được truyền cảm hứng từ những thành viên xuất sắc nhất
          trong cộng đồng QuitSmoke
        </Typography>
        
        {/* Time Filter */}
        <Box className="time-filter">
          <FormControl size="small">
            <Select
              value={timeFilter}
              onChange={handleTimeFilterChange}
              displayEmpty
              className="time-select"
            >
              <MenuItem value="all">Tất cả thời gian</MenuItem>
              <MenuItem value="month">Tháng này</MenuItem>
              <MenuItem value="week">Tuần này</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      {/* Top 3 Section */}
      <div className="top3-section">
        {top3.length >= 2 && (
          <div className="top3-container">
            {/* Rank 2 */}
            <div className="rank-card rank-2">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  top3[1]?.userName || "Ẩn danh"
                )}&background=C0C0C0&color=fff`}
                className="rank-avatar"
                sx={{ width: 80, height: 80 }}
              />
              <Typography className="rank-name">{top3[1]?.userName || "Ẩn danh"}</Typography>
              <Typography className="rank-badge">Hạng 2</Typography>
              <Typography className="rank-days">{top3[1]?.score || 0}</Typography>
              <Typography className="rank-label">ngày không hút thuốc</Typography>
              <Typography className="rank-savings">
                {formatMoney(calculateSavings(top3[1]?.score || 0))} đã tiết kiệm
              </Typography>
            </div>

            {/* Rank 1 */}
            <div className="rank-card rank-1">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  top3[0]?.userName || "Ẩn danh"
                )}&background=FFD700&color=fff`}
                className="rank-avatar"
                sx={{ width: 100, height: 100 }}
              />
              <Typography className="rank-name">{top3[0]?.userName || "Ẩn danh"}</Typography>
              <Typography className="rank-badge champion">Vô địch</Typography>
              <Typography className="rank-days">{top3[0]?.score || 0}</Typography>
              <Typography className="rank-label">ngày không hút thuốc</Typography>
              <Typography className="rank-savings">
                {formatMoney(calculateSavings(top3[0]?.score || 0))} đã tiết kiệm
              </Typography>
            </div>

            {/* Rank 3 */}
            {top3.length >= 3 && (
              <div className="rank-card rank-3">
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    top3[2]?.userName || "Ẩn danh"
                  )}&background=CD7F32&color=fff`}
                  className="rank-avatar"
                  sx={{ width: 80, height: 80 }}
                />
                <Typography className="rank-name">{top3[2]?.userName || "Ẩn danh"}</Typography>
                <Typography className="rank-badge">Hạng 3</Typography>
                <Typography className="rank-days">{top3[2]?.score || 0}</Typography>
                <Typography className="rank-label">ngày không hút thuốc</Typography>
                <Typography className="rank-savings">
                  {formatMoney(calculateSavings(top3[2]?.score || 0))} đã tiết kiệm
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Ranking List */}
      <div className="detailed-ranking">
        <Typography variant="h6" className="section-title">
          Bảng xếp hạng chi tiết
        </Typography>
        
        <Paper className="ranking-list">
          {ranking.map((user, index) => (
            <div key={user.rankingId || index} className={`ranking-item ${index < 3 ? `top-${index + 1}` : ''}`}>
              <div className="ranking-left">
                <Typography className="ranking-position">#{index + 1}</Typography>
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.userName || "Ẩn danh"
                  )}`}
                  className="ranking-avatar"
                />
                <div className="ranking-info">
                  <Typography className="ranking-name">{user.userName || "Ẩn danh"}</Typography>
                  <Typography className="ranking-badge">
                    {index === 0 ? "Vô địch" : index === 1 ? "Hạng 2" : index === 2 ? "Hạng 3" : "Hạng 4"}
                  </Typography>
                </div>
              </div>
              
              <div className="ranking-right">
                <div className="ranking-stats">
                  <Typography className="ranking-days">{user.score} ngày</Typography>
                  <Typography className="ranking-savings">
                    {formatMoney(calculateSavings(user.score))} đã tiết kiệm
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </Paper>
      </div>
    </div>
  );
}
