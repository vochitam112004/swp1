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
import { baseApiUrl } from "../../../api/axios";
import badgeService from "../../../api/badgeService";

export default function BadgesTab() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const result = await badgeService.getMyBadges();
        if (result.success) {
          setBadges(result.badges);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast.error("Không lấy được huy hiệu!");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchBadges();
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
        🏆 Huy hiệu
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
    </Box>
  );
}