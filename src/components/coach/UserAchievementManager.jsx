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
import Autocomplete from "@mui/material/Autocomplete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import achievementService from "../../api/achievementService";
import api from "../../api/axios";

export default function UserAchievementManager() {
  const [userAchievements, setUserAchievements] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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

  // Fetch all users for selection
  const fetchAllUsers = async () => {
    try {
      const res = await api.get("/User/Get-All-User");
      setUserOptions(res.data); // [{userId, displayName, email, ...}]
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng!");
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
    fetchAllUsers();
  }, []);

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

  // Calculate progress statistics (dựa trên tiền tiết kiệm)
  const getProgressStats = () => {
    if (!userAchievements.length || !selectedUserId) return null;

    // Lấy thành tích mới nhất (theo lastUpdated)
    const latestAchievement = userAchievements.reduce((latest, current) => {
      return new Date(current.lastUpdated) > new Date(latest.lastUpdated) ? current : latest;
    });

    // Lấy tổng số tiền đã tiết kiệm lớn nhất trong các thành tích đã đạt
    const maxMoneySaved = Math.max(
      ...userAchievements.map(a => a.template?.requiredMoneySaved || 0)
    );

    // Tìm thành tích tiếp theo dựa trên requiredMoneySaved
    const nextTemplate = templates
      .filter(t => t.requiredMoneySaved > maxMoneySaved)
      .sort((a, b) => a.requiredMoneySaved - b.requiredMoneySaved)[0];

    return {
      currentMoney: maxMoneySaved,
      achievementsCount: userAchievements.length,
      totalTemplates: templates.length,
      nextAchievement: nextTemplate,
      moneyUntilNext: nextTemplate ? nextTemplate.requiredMoneySaved - maxMoneySaved : 0
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

      {/* User Selection Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Chọn người dùng
          </Typography>
          <Autocomplete
            options={userOptions}
            getOptionLabel={(option) =>
              `${option.displayName || option.userName} (${option.email})`
            }
            value={selectedUser}
            onChange={(e, value) => {
              setSelectedUser(value);
              if (value) {
                fetchUserAchievements(value.userId);
              } else {
                setSelectedUserId(null);
                setUserAchievements([]);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Tìm kiếm hoặc chọn người dùng" placeholder="Nhập tên, email..." />
            )}
            sx={{ width: 400, mb: 1 }}
            isOptionEqualToValue={(option, value) => option.userId === value.userId}
          />
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
                    {selectedUser && (
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {selectedUser.displayName || selectedUser.userName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {selectedUser.email}
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
                      💰 Tiền tiết kiệm lớn nhất: <strong>{progressStats.currentMoney.toLocaleString('vi-VN')} VNĐ</strong>
                    </Typography>
                    <Typography variant="body2">
                      🏆 Thành tích đạt được: <strong>{progressStats.achievementsCount}/{progressStats.totalTemplates}</strong>
                    </Typography>
                    {progressStats.nextAchievement ? (
                      <Typography variant="body2" color="warning.main">
                        🎯 Thành tích tiếp theo: <strong>{progressStats.nextAchievement.name}</strong>
                        <br />
                        (Còn {progressStats.moneyUntilNext.toLocaleString('vi-VN')} VNĐ)
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
                          label={`${achievement.template?.requiredMoneySaved?.toLocaleString('vi-VN') || 0} VNĐ`}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(achievement.lastUpdated).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Đã đạt"
                          color="success"
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
            Chọn người dùng để xem thành tích
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Hãy chọn một người dùng để xem và quản lý thành tích của họ
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
                      Yêu cầu: {template.requiredMoneySaved?.toLocaleString('vi-VN')} VNĐ - {template.description}
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