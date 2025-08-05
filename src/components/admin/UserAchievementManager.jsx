import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  Alert,
  Avatar,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import achievementService from "../../api/achievementService";
import { baseApiUrl } from "../../api/axios";

export default function UserAchievementManager() {
  const [userAchievements, setUserAchievements] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Fetch achievement templates
  const fetchTemplates = async () => {
    try {
      const result = await achievementService.getAllTemplates();
      if (result.success) {
        setTemplates(result.templates);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Không thể tải danh sách mẫu thành tích!");
    }
  };

  // Fetch user achievements
  const fetchUserAchievements = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const result = await achievementService.getUserAchievements(userId);
      if (result.success) {
        setUserAchievements(result.achievements);
        setSelectedUserId(userId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      toast.error("Không thể tải thành tích của người dùng!");
      setUserAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle search user
  const handleSearchUser = () => {
    const userId = parseInt(searchUserId);
    if (isNaN(userId) || userId <= 0) {
      toast.warn("Vui lòng nhập ID người dùng hợp lệ!");
      return;
    }
    fetchUserAchievements(userId);
  };

  // Handle assign achievement
  const handleAssignAchievement = async () => {
    if (!selectedUserId || !selectedTemplateId) {
      toast.warn("Vui lòng chọn mẫu thành tích!");
      return;
    }

    try {
      const result = await achievementService.assignAchievement({
        userId: selectedUserId,
        templateId: parseInt(selectedTemplateId)
      });

      if (result.success) {
        toast.success("Đã gán thành tích cho người dùng!");
        setAssignDialogOpen(false);
        setSelectedTemplateId("");
        fetchUserAchievements(selectedUserId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error assigning achievement:", error);
      toast.error("Gán thành tích thất bại!");
    }
  };

  // Handle remove achievement
  const handleRemoveAchievement = async (templateId) => {
    if (!window.confirm("Bạn có chắc chắn muốn thu hồi thành tích này?")) return;

    try {
      const result = await achievementService.removeUserAchievement(selectedUserId, templateId);
      if (result.success) {
        toast.success("Đã thu hồi thành tích!");
        fetchUserAchievements(selectedUserId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error removing achievement:", error);
      toast.error("Thu hồi thành tích thất bại!");
    }
  };

  // Get available templates for assignment (not already assigned)
  const getAvailableTemplates = () => {
    const assignedTemplateIds = userAchievements.map(ua => ua.templateId);
    return templates.filter(template => !assignedTemplateIds.includes(template.templateId));
  };

  // Calculate progress statistics
  const getProgressStats = () => {
    if (!userAchievements.length || !selectedUserId) return null;

    const latestAchievement = userAchievements.reduce((latest, current) => {
      return new Date(current.lastUpdated) > new Date(latest.lastUpdated) ? current : latest;
    });

    const totalDays = latestAchievement.smokeFreeDays;
    const nextTemplate = templates
      .filter(t => t.requiredSmokeFreeDays > totalDays)
      .sort((a, b) => a.requiredSmokeFreeDays - b.requiredSmokeFreeDays)[0];

    return {
      currentDays: totalDays,
      achievementsCount: userAchievements.length,
      totalTemplates: templates.length,
      nextAchievement: nextTemplate,
      daysUntilNext: nextTemplate ? nextTemplate.requiredSmokeFreeDays - totalDays : 0
    };
  };

  const progressStats = getProgressStats();

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon color="primary" sx={{ fontSize: '2rem' }} />
          <Typography variant="h5" fontWeight="bold">
            Quản lý thành tích người dùng
          </Typography>
        </Box>
      </Box>

      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tìm kiếm người dùng
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="ID người dùng"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              type="number"
              placeholder="Nhập ID người dùng"
              size="small"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchUser();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchUser}
              startIcon={<SearchIcon />}
              disabled={!searchUserId.trim()}
            >
              Tìm kiếm
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* User Info and Progress */}
      {selectedUserId && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Thông tin người dùng
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      User ID: {selectedUserId}
                    </Typography>
                    {userAchievements.length > 0 && userAchievements[0].user && (
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {userAchievements[0].user.displayName || userAchievements[0].user.username}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {userAchievements[0].user.email}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {progressStats && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    Tiến độ thành tích
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      📅 Ngày không hút thuốc: <strong>{progressStats.currentDays} ngày</strong>
                    </Typography>
                    <Typography variant="body2">
                      🏆 Thành tích đạt được: <strong>{progressStats.achievementsCount}/{progressStats.totalTemplates}</strong>
                    </Typography>
                    {progressStats.nextAchievement ? (
                      <Typography variant="body2" color="warning.main">
                        🎯 Thành tích tiếp theo: <strong>{progressStats.nextAchievement.name}</strong>
                        <br />
                        (Còn {progressStats.daysUntilNext} ngày)
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="success.main">
                        🎉 Đã hoàn thành tất cả thành tích!
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Action Buttons */}
      {selectedUserId && (
        <Box mb={3} display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAssignDialogOpen(true)}
            disabled={getAvailableTemplates().length === 0}
          >
            Gán thành tích mới
          </Button>
          {getAvailableTemplates().length === 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ alignSelf: 'center' }}>
              Người dùng đã có tất cả thành tích
            </Typography>
          )}
        </Box>
      )}

      {/* User Achievements Table */}
      {selectedUserId && (
        <>
          {loading ? (
            <Box textAlign="center" py={4}>
              <Typography>Đang tải...</Typography>
            </Box>
          ) : userAchievements.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Thành tích</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Yêu cầu</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ngày hiện tại</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Cập nhật lần cuối</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userAchievements.map((achievement) => (
                    <TableRow key={achievement.achievementId} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EmojiEventsIcon color="warning" />
                          <Box>
                            <Typography fontWeight="medium">
                              {achievement.template?.name || "Unknown"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {achievement.template?.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${achievement.template?.requiredSmokeFreeDays || 0} ngày`}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color="success.main">
                          {achievement.smokeFreeDays} ngày
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(achievement.lastUpdated).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            achievement.smokeFreeDays >= (achievement.template?.requiredSmokeFreeDays || 0)
                              ? "Đã đạt"
                              : "Chưa đạt"
                          }
                          color={
                            achievement.smokeFreeDays >= (achievement.template?.requiredSmokeFreeDays || 0)
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveAchievement(achievement.templateId)}
                          size="small"
                          title="Thu hồi thành tích"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              Người dùng này chưa có thành tích nào.
            </Alert>
          )}
        </>
      )}

      {!selectedUserId && (
        <Box textAlign="center" py={8}>
          <SearchIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Tìm kiếm người dùng để xem thành tích
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Nhập ID người dùng để xem và quản lý thành tích của họ
          </Typography>
        </Box>
      )}

      {/* Assign Achievement Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AddIcon color="primary" />
            Gán thành tích mới
          </Box>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Chọn mẫu thành tích</InputLabel>
            <Select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              label="Chọn mẫu thành tích"
            >
              {getAvailableTemplates().map((template) => (
                <MenuItem key={template.templateId} value={template.templateId}>
                  <Box>
                    <Typography>{template.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Yêu cầu: {template.requiredSmokeFreeDays} ngày - {template.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleAssignAchievement}
            disabled={!selectedTemplateId}
          >
            Gán thành tích
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
