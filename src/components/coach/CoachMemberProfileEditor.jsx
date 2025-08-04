import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function CoachMemberProfileEditor({ memberProfile, setMemberProfile, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Smoking habits - simplified to match API
    cigarettesSmoked: 0,
    quitAttempts: 0,
    experienceLevel: 0,
    pricePerPack: 25000,
    cigarettesPerPack: 20,
    
    // Health information - simplified according to API
    health: '',
    
    // Personal motivation
    personalMotivation: '',
  });

  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);

  // Update form data when memberProfile changes
  useEffect(() => {
    if (memberProfile) {
      setFormData({
        cigarettesSmoked: memberProfile.cigarettesSmoked || 0,
        quitAttempts: memberProfile.quitAttempts || 0,
        experienceLevel: memberProfile.experienceLevel || 0,
        pricePerPack: memberProfile.pricePerPack || 25000,
        cigarettesPerPack: memberProfile.cigarettesPerPack || 20,
        health: memberProfile.health || '',
        personalMotivation: memberProfile.personalMotivation || '',
      });
    }
  }, [memberProfile]);

  // Fetch badges and history
  useEffect(() => {
    if (memberProfile?.memberId) {
      fetchBadgesAndHistory();
    }
  }, [memberProfile]);

  const fetchBadgesAndHistory = async () => {
    try {
      const [badgesRes, historyRes] = await Promise.all([
        api.get(`/Badge/GetByMemberId/${memberProfile.memberId}`),
        api.get(`/MembershipHistory/GetByMemberId/${memberProfile.memberId}`)
      ]);
      setBadges(badgesRes.data || []);
      setHistory(historyRes.data || []);
    } catch (error) {
      console.error("Error fetching badges/history:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!memberProfile?.memberId) {
      toast.error("Không tìm thấy thông tin hồ sơ!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updateData = {
        cigarettesSmoked: parseInt(formData.cigarettesSmoked) || 0,
        quitAttempts: parseInt(formData.quitAttempts) || 0,
        experienceLevel: parseInt(formData.experienceLevel) || 0,
        personalMotivation: formData.personalMotivation || '',
        health: formData.health || '',
        pricePerPack: parseInt(formData.pricePerPack) || 25000,
        cigarettesPerPack: parseInt(formData.cigarettesPerPack) || 20,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put('/api/MemberProfile/UpdateMyMemberProfile', updateData);
      
      setMemberProfile({ ...memberProfile, ...response.data });
      setIsEditing(false);
      toast.success("Đã cập nhật thông tin thành công!");
      
      // Close dialog if onClose prop is provided
      if (onClose) {
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật hồ sơ:", err);
      toast.error(err.response?.data?.message || "Cập nhật hồ sơ thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      cigarettesSmoked: memberProfile?.cigarettesSmoked || 0,
      quitAttempts: memberProfile?.quitAttempts || 0,
      experienceLevel: memberProfile?.experienceLevel || 0,
      pricePerPack: memberProfile?.pricePerPack || 25000,
      cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
      health: memberProfile?.health || '',
      personalMotivation: memberProfile?.personalMotivation || '',
    });
    setIsEditing(false);
  };

  if (!memberProfile) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
          👤 Chưa có thông tin hồ sơ
        </Typography>
        <Typography color="textSecondary">
          Thành viên này chưa tạo hồ sơ cá nhân
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          📋 Thông tin chi tiết thành viên
        </Typography>
        {!isEditing && (
          <Button 
            variant="contained"
            onClick={() => setIsEditing(true)}
            startIcon={<span>✏️</span>}
          >
            Chỉnh sửa
          </Button>
        )}
      </Box>

      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ width: '100%' }}
        noValidate
        autoComplete="off"
      >
        {/* Smoking Information */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: '#ff9800' }}>
              🚬 Thông tin hút thuốc
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tình trạng hút thuốc</InputLabel>
                  <Select
                    name="smokingStatus"
                    value={formData.smokingStatus}
                    onChange={handleFormChange}
                    disabled={!isEditing}
                    label="Tình trạng hút thuốc"
                  >
                    <MenuItem value="">Chọn tình trạng</MenuItem>
                    <MenuItem value="Đang hút">Đang hút</MenuItem>
                    <MenuItem value="Đang cai">Đang cai</MenuItem>
                    <MenuItem value="Đã cai">Đã cai</MenuItem>
                    <MenuItem value="Thỉnh thoảng">Thỉnh thoảng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số lần cai thuốc"
                  name="quitAttempts"
                  type="number"
                  value={formData.quitAttempts}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số điếu thuốc mỗi ngày"
                  name="dailyCigarettes"
                  type="number"
                  value={formData.dailyCigarettes}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số năm hút thuốc"
                  name="yearsOfSmoking"
                  type="number"
                  value={formData.yearsOfSmoking}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Giá 1 gói thuốc (VNĐ)"
                  name="packPrice"
                  type="number"
                  value={formData.packPrice}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số điếu trong 1 gói"
                  name="cigarettesPerPack"
                  type="number"
                  value={formData.cigarettesPerPack}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Các yếu tố kích thích hút thuốc"
                  name="smokingTriggers"
                  value={formData.smokingTriggers}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Health Information */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: '#4caf50' }}>
              🏥 Thông tin sức khỏe
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Tình trạng sức khỏe hiện tại"
                  name="healthConditions"
                  value={formData.healthConditions}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Mô tả các vấn đề sức khỏe hiện tại (nếu có)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dị ứng"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                  helperText="Các loại dị ứng đã biết"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Thuốc đang sử dụng"
                  name="medications"
                  value={formData.medications}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Danh sách thuốc đang dùng thường xuyên"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Lịch sử vấn đề sức khỏe"
                  name="previousHealthIssues"
                  value={formData.previousHealthIssues}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Các vấn đề sức khỏe đã gặp trước đây"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Badges and Membership */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: '#9c27b0' }}>
              🏆 Huy hiệu & Thành viên
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Huy hiệu đã đạt được:
                </Typography>
                {badges.length === 0 ? (
                  <Typography color="textSecondary">
                    Chưa có huy hiệu nào
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {badges.map((badge) => (
                      <Chip
                        key={badge.badgeId}
                        label={badge.badgeName}
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Lịch sử thành viên:
                </Typography>
                {history.length === 0 ? (
                  <Typography color="textSecondary">
                    Chưa có lịch sử thành viên
                  </Typography>
                ) : (
                  <Box>
                    {history.slice(0, 3).map((item, index) => (
                      <Box key={index} sx={{ mb: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>Loại:</strong> {item.membershipType || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Ngày:</strong> {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Action Buttons */}
        {isEditing && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              sx={{ minWidth: 120 }}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
