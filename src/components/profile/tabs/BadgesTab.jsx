import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent
} from "@mui/material";
import { toast } from "react-toastify";
import api, { baseApiUrl } from "../../../api/axios";

export default function BadgesTab() {
  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await api.get("/Badge/My-Badge");
        const data = res.data;
        if (Array.isArray(data)) {
          setBadges(data);
        } else if (data?.iconUrl) {
          setBadges([data]);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast.error("Không lấy được huy hiệu!");
      }
    };

    const fetchMembershipHistory = async () => {
      try {
        const res = await api.get("/UserMemberShipHistory/my-history");
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching membership history:", error);
        toast.error("Không lấy được lịch sử gói thành viên!");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBadges(), fetchMembershipHistory()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#ff9800' }}>
        🏆 Huy hiệu & Thành viên
      </Typography>

      {/* Badges Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#ff9800', display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>🎖️</span>
          Huy hiệu của bạn
        </Typography>
        
        {badges.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
              🏅 Chưa có huy hiệu nào
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Hoàn thành các thử thách để nhận huy hiệu!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {badges.map((badge, idx) => (
              <Grid item xs={12} sm={6} md={4} key={badge.badgeId || idx}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(255, 152, 0, 0.2)',
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <img
                        src={
                          badge.iconUrl?.startsWith("http")
                            ? badge.iconUrl
                            : `${baseApiUrl}${badge.iconUrl}`
                        }
                        alt={badge.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'contain',
                          borderRadius: '50%',
                          border: '3px solid #ff9800',
                          padding: '8px',
                          backgroundColor: 'white'
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                      {badge.name}
                    </Typography>
                    {badge.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {badge.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Membership History Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#2196f3', display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>📅</span>
          Lịch sử gói thành viên
        </Typography>
        
        {history.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
              📋 Chưa có lịch sử gói thành viên
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Hãy đăng ký gói thành viên để bắt đầu hành trình cai thuốc!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {history.map((item, idx) => (
              <Card 
                key={idx} 
                sx={{ 
                  mb: 2, 
                  border: '1px solid #e3f2fd',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        {item.planName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Ngày bắt đầu
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(item.startDate).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Ngày kết thúc
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: item.endDate ? '#333' : '#4caf50'
                        }}
                      >
                        {item.endDate ? new Date(item.endDate).toLocaleDateString("vi-VN") : "Hiện tại"}
                      </Typography>
                      {!item.endDate && (
                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                          • Đang hoạt động
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  
                  {item.status && (
                    <Box sx={{ mt: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'inline-block',
                          px: 2, 
                          py: 0.5, 
                          borderRadius: '12px', 
                          backgroundColor: item.status === 'Active' ? '#e8f5e8' : '#f5f5f5',
                          color: item.status === 'Active' ? '#2e7d32' : '#666',
                          fontWeight: 600
                        }}
                      >
                        {item.status}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Achievement Statistics */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: '#fff3e0', border: '1px solid #ffcc02' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#f57c00' }}>
          📊 Thống kê thành tích
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {badges.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Huy hiệu đã đạt được
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                {history.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gói thành viên đã sử dụng
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}