import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Stack,
  Divider
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import { toast } from "react-toastify";
import achievementService from "../../api/achievementService";
import { useUser } from "../../contexts/UserContext";

export default function UserAchievementsTab() {
  const [achievements, setAchievements] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Fetch user achievements and templates
  const fetchData = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      const [achievementsResult, templatesResult] = await Promise.all([
        achievementService.getUserAchievements(user.userId),
        achievementService.getAllTemplates()
      ]);

      if (achievementsResult.success) {
        setAchievements(achievementsResult.achievements);
      } else {
        console.error("Error fetching achievements:", achievementsResult.error);
      }

      if (templatesResult.success) {
        setTemplates(templatesResult.templates);
      } else {
        console.error("Error fetching templates:", templatesResult.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải thông tin thành tích!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.userId]);

  // Get current smoke-free days (from latest achievement)
  const getCurrentSmokeFreeDays = () => {
    if (achievements.length === 0) return 0;
    return Math.max(...achievements.map(a => a.smokeFreeDays));
  };

  // Calculate progress statistics
  const getProgressStats = () => {
    const currentDays = getCurrentSmokeFreeDays();
    const completedCount = achievements.length;
    const totalCount = templates.length;
    
    const nextTemplate = templates
      .filter(t => t.requiredSmokeFreeDays > currentDays)
      .sort((a, b) => a.requiredSmokeFreeDays - b.requiredSmokeFreeDays)[0];

    const qualifyingTemplates = achievementService.getQualifyingTemplates(currentDays, templates);
    
    return {
      currentDays,
      completedCount,
      totalCount,
      nextTemplate,
      daysUntilNext: nextTemplate ? nextTemplate.requiredSmokeFreeDays - currentDays : 0,
      progressPercentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
      qualifyingCount: qualifyingTemplates.length
    };
  };

  // Get achievement level based on required days
  const getAchievementLevel = (requiredDays) => {
    if (requiredDays >= 365) return { level: "Chuyên gia", color: "error", icon: "🏆" };
    if (requiredDays >= 90) return { level: "Nâng cao", color: "warning", icon: "🥇" };
    if (requiredDays >= 30) return { level: "Trung cấp", color: "info", icon: "🥈" };
    if (requiredDays >= 7) return { level: "Cơ bản", color: "success", icon: "🥉" };
    return { level: "Mới bắt đầu", color: "default", icon: "⭐" };
  };

  const stats = getProgressStats();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Đang tải thành tích...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#ff9800' }}>
        🏆 Thành tích cá nhân
      </Typography>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUpIcon />
                <Typography variant="h6">Ngày không hút thuốc</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.currentDays}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Ngày liên tiếp
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <EmojiEventsIcon />
                <Typography variant="h6">Thành tích đạt được</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.completedCount}/{stats.totalCount}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.progressPercentage}
                sx={{ 
                  mt: 1, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <StarIcon />
                <Typography variant="h6">Thành tích tiếp theo</Typography>
              </Box>
              {stats.nextTemplate ? (
                <>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {stats.nextTemplate.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Còn {stats.daysUntilNext} ngày
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h6" fontWeight="bold">
                    Hoàn thành tất cả!
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Chúc mừng bạn! 🎉
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Achievements List */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEventsIcon color="warning" />
          Thành tích đã đạt được ({achievements.length})
        </Typography>
        
        {achievements.length > 0 ? (
          <Grid container spacing={2}>
            {achievements
              .sort((a, b) => (b.template?.requiredSmokeFreeDays || 0) - (a.template?.requiredSmokeFreeDays || 0))
              .map((achievement) => {
                const level = getAchievementLevel(achievement.template?.requiredSmokeFreeDays || 0);
                const isCompleted = achievement.smokeFreeDays >= (achievement.template?.requiredSmokeFreeDays || 0);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={achievement.achievementId}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        border: isCompleted ? '2px solid #4caf50' : '1px solid #e0e0e0',
                        boxShadow: isCompleted ? '0 4px 12px rgba(76, 175, 80, 0.2)' : 1,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: isCompleted ? '0 8px 25px rgba(76, 175, 80, 0.3)' : 3,
                        }
                      }}
                    >
                      <CardContent>
                        <Box textAlign="center" mb={2}>
                          <Typography variant="h3" sx={{ mb: 1 }}>
                            {level.icon}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {achievement.template?.name || "Unknown"}
                          </Typography>
                          <Chip 
                            label={level.level}
                            color={level.color}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="textSecondary">
                              Yêu cầu:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {achievement.template?.requiredSmokeFreeDays || 0} ngày
                            </Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="textSecondary">
                              Hiện tại:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={isCompleted ? "success.main" : "warning.main"}
                            >
                              {achievement.smokeFreeDays} ngày
                            </Typography>
                          </Box>

                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="textSecondary">
                              Trạng thái:
                            </Typography>
                            <Chip
                              label={isCompleted ? "Đã đạt" : "Chưa đạt"}
                              color={isCompleted ? "success" : "warning"}
                              size="small"
                            />
                          </Box>

                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Cập nhật: {new Date(achievement.lastUpdated).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Stack>

                        {achievement.template?.description && (
                          <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                              {achievement.template.description}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              🎯 Chưa có thành tích nào
            </Typography>
            <Typography>
              Hãy tiếp tục hành trình cai thuốc để nhận được thành tích đầu tiên!
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Upcoming Achievements */}
      {stats.nextTemplate && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            Thành tích sắp tới
          </Typography>
          
          <Card sx={{ border: '1px dashed #2196f3', backgroundColor: '#f3f8ff' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {stats.nextTemplate.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {stats.nextTemplate.description}
                  </Typography>
                  <Chip 
                    label={`Yêu cầu: ${stats.nextTemplate.requiredSmokeFreeDays} ngày`}
                    color="primary"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4} textAlign="center">
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {stats.daysUntilNext}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ngày nữa để đạt được
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={((stats.nextTemplate.requiredSmokeFreeDays - stats.daysUntilNext) / stats.nextTemplate.requiredSmokeFreeDays) * 100}
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Paper>
      )}
    </Box>
  );
}
