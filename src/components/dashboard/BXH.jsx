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
import { baseApiUrl } from "../../api/axios";

export default function BXH() {
  const [ranking, setRanking] = useState([]);
  const [badges, setBadges] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const getBadgeForScore = (score, allBadges) => {
    return allBadges.find(badge => score >= badge.requiredScore) || null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rankingRes, badgesRes] = await Promise.all([
          api.get("/Ranking/GetAllRankings"),
          api.get("/Badge/GetAllBadge")
        ]);

        const rankingData = Array.isArray(rankingRes.data) ? rankingRes.data : [];
        const badgesData = Array.isArray(badgesRes.data) ? badgesRes.data : [];

        const sortedBadges = badgesData.sort((a, b) => b.requiredScore - a.requiredScore);
        setBadges(sortedBadges);

        const rankingWithBadges = rankingData.map(user => ({
          ...user,
          badge: getBadgeForScore(user.score, sortedBadges)
        }));

        const sortedRanking = rankingWithBadges.sort((a, b) => b.score - a.score);
        setRanking(sortedRanking);

      } catch (error) {
        console.error("Lỗi lấy dữ liệu bảng xếp hạng hoặc huy hiệu:", error);
      }
    };

    fetchData();
  }, [timeFilter]);

  const top3 = ranking.slice(0, 3);

  const calculateSavings = (days) => {
    const pricePerPack = 50000;
    const packsPerDay = 1;
    return days * packsPerDay * pricePerPack;
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const renderBadge = (badge) => {
    if (!badge) {
        return <Typography className="rank-badge">Tân binh</Typography>;
    }
    return (
        <Typography component="div" className="rank-badge">
            {/* FIX 1: Thêm baseApiUrl vào src của icon */}
            {badge.iconUrl && <img src={`${baseApiUrl}${badge.iconUrl}`} alt={badge.name} className="badge-icon" />}
            {badge.name}
        </Typography>
    );
  }

  return (
    <div className="bxh-container">
      <div className="bxh-header">
        <Typography variant="h4" className="bxh-title">
          Bảng xếp hạng cộng đồng
        </Typography>
        <Typography variant="body1" className="bxh-subtitle">
          Xem thứ hạng của bạn và được truyền cảm hứng từ những thành viên xuất sắc nhất
          trong cộng đồng QuitSmoke
        </Typography>
        
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

      <div className="top3-section">
        {top3.length >= 2 && (
          <div className="top3-container">
            <div className="rank-card rank-2">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  top3[1]?.userName || "Ẩn danh"
                )}&background=C0C0C0&color=fff`}
                className="rank-avatar"
                sx={{ width: 80, height: 80 }}
              />
              <Typography className="rank-name">{top3[1]?.userName || "Ẩn danh"}</Typography>
              {renderBadge(top3[1]?.badge)}
              <Typography className="rank-days">{top3[1]?.score || 0}</Typography>
              <Typography className="rank-label">ngày không hút thuốc</Typography>
              <Typography className="rank-savings">
                {formatMoney(calculateSavings(top3[1]?.score || 0))} đã tiết kiệm
              </Typography>
            </div>

            <div className="rank-card rank-1">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  top3[0]?.userName || "Ẩn danh"
                )}&background=FFD700&color=fff`}
                className="rank-avatar"
                sx={{ width: 100, height: 100 }}
              />
              <Typography className="rank-name">{top3[0]?.userName || "Ẩn danh"}</Typography>
              {renderBadge(top3[0]?.badge)}
              <Typography className="rank-days">{top3[0]?.score || 0}</Typography>
              <Typography className="rank-label">ngày không hút thuốc</Typography>
              <Typography className="rank-savings">
                {formatMoney(calculateSavings(top3[0]?.score || 0))} đã tiết kiệm
              </Typography>
            </div>

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
                {renderBadge(top3[2]?.badge)}
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
                  <div className="ranking-badge-container">
                    {user.badge?.iconUrl && (
                        /* FIX 3: Xóa width={50} để dùng CSS */
                        <img src={`${baseApiUrl}${user.badge.iconUrl}`} alt={user.badge.name} className="badge-icon" />
                    )}
                    {/* FIX 2: Thêm lại tên huy hiệu */}
                    <Typography className="ranking-badge-name">
                      {user.badge?.name || 'Tân binh'}
                    </Typography>
                  </div>
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