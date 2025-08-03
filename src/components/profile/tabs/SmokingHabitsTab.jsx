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
  MenuItem
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../api/axios";

export default function SmokingHabitsTab({ memberProfile, setMemberProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    smokingStatus: memberProfile?.smokingStatus || '',
    quitAttempts: memberProfile?.quitAttempts || 0,
    experienceLevel: memberProfile?.experienceLevel || 0,
    previousAttempts: memberProfile?.previousAttempts || '',
    dailyCigarettes: memberProfile?.dailyCigarettes || 0,
    yearsOfSmoking: memberProfile?.yearsOfSmoking || 0,
    packPrice: memberProfile?.packPrice || 25000,
    cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
    smokingTriggers: memberProfile?.smokingTriggers || '',
    preferredBrand: memberProfile?.preferredBrand || '',
    smokingPattern: memberProfile?.smokingPattern || '',
  });

  // Update form data when memberProfile changes
  useEffect(() => {
    if (memberProfile) {
      setFormData({
        smokingStatus: memberProfile.smokingStatus || '',
        quitAttempts: memberProfile.quitAttempts || 0,
        experienceLevel: memberProfile.experienceLevel || 0,
        previousAttempts: memberProfile.previousAttempts || '',
        dailyCigarettes: memberProfile.dailyCigarettes || 0,
        yearsOfSmoking: memberProfile.yearsOfSmoking || 0,
        packPrice: memberProfile.packPrice || 25000,
        cigarettesPerPack: memberProfile.cigarettesPerPack || 20,
        smokingTriggers: memberProfile.smokingTriggers || '',
        preferredBrand: memberProfile.preferredBrand || '',
        smokingPattern: memberProfile.smokingPattern || '',
      });
    }
  }, [memberProfile]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let updateData = {
        smokingStatus: formData.smokingStatus,
        quitAttempts: parseInt(formData.quitAttempts) || 0,
        experienceLevel: parseInt(formData.experienceLevel) || 0,
        previousAttempts: formData.previousAttempts,
        dailyCigarettes: parseInt(formData.dailyCigarettes) || 0,
        yearsOfSmoking: parseInt(formData.yearsOfSmoking) || 0,
        packPrice: parseInt(formData.packPrice) || 25000,
        cigarettesPerPack: parseInt(formData.cigarettesPerPack) || 20,
        smokingTriggers: formData.smokingTriggers,
        preferredBrand: formData.preferredBrand,
        smokingPattern: formData.smokingPattern,
      };

      if (memberProfile?.memberId) {
        // Update existing member profile
        updateData.memberId = memberProfile.memberId;
        await api.put(`/MemberProfile/${memberProfile.memberId}`, updateData);
        setMemberProfile({ ...memberProfile, ...updateData });
      } else {
        // Create new member profile for coaches who don't have one
        const response = await api.post('/MemberProfile', updateData);
        setMemberProfile(response.data);
      }
      
      setIsEditing(false);
      toast.success("Đã cập nhật thông tin hút thuốc thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật hồ sơ:", err);
      toast.error(err.response?.data?.message || "Cập nhật hồ sơ thất bại!");
    }
  };

  const handleCancel = () => {
    setFormData({
      smokingStatus: memberProfile?.smokingStatus || '',
      quitAttempts: memberProfile?.quitAttempts || 0,
      experienceLevel: memberProfile?.experienceLevel || 0,
      previousAttempts: memberProfile?.previousAttempts || '',
      dailyCigarettes: memberProfile?.dailyCigarettes || 0,
      yearsOfSmoking: memberProfile?.yearsOfSmoking || 0,
      packPrice: memberProfile?.packPrice || 25000,
      cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
      smokingTriggers: memberProfile?.smokingTriggers || '',
      preferredBrand: memberProfile?.preferredBrand || '',
      smokingPattern: memberProfile?.smokingPattern || '',
    });
    setIsEditing(false);
  };

  if (memberProfile === null) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
          👤 Chưa có thông tin hồ sơ
        </Typography>
        <Typography color="textSecondary">
          Hãy tạo hồ sơ cá nhân để bắt đầu hành trình cai thuốc
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          🚬 Thông tin hút thuốc
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

      <form onSubmit={handleSubmit}>
        {/* Basic Smoking Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2196f3' }}>
            Thông tin cơ bản
          </Typography>
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
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mức độ kinh nghiệm</InputLabel>
                <Select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  label="Mức độ kinh nghiệm"
                >
                  <MenuItem value={0}>Người mới bắt đầu</MenuItem>
                  <MenuItem value={1}>Có chút kinh nghiệm</MenuItem>
                  <MenuItem value={2}>Có kinh nghiệm</MenuItem>
                  <MenuItem value={3}>Rất có kinh nghiệm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Lịch sử cai thuốc trước đây"
                name="previousAttempts"
                value={formData.previousAttempts}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                multiline
                rows={3}
                placeholder="Mô tả các lần cai thuốc trước đây, nguyên nhân thất bại, bài học kinh nghiệm..."
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Smoking Habits Details */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2196f3' }}>
            Thói quen hút thuốc
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điếu thuốc mỗi ngày"
                name="dailyCigarettes"
                type="number"
                value={formData.dailyCigarettes}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                inputProps={{ min: 0, max: 100 }}
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
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điếu thuốc trong 1 gói"
                name="cigarettesPerPack"
                type="number"
                value={formData.cigarettesPerPack}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                inputProps={{ min: 1, max: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giá tiền 1 gói thuốc (VND)"
                name="packPrice"
                type="number"
                value={formData.packPrice}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                inputProps={{ min: 1000, step: 1000 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Thương hiệu thuốc ưa thích"
                name="preferredBrand"
                value={formData.preferredBrand}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                placeholder="Ví dụ: Marlboro, Lucky Strike..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Thói quen hút thuốc</InputLabel>
                <Select
                  name="smokingPattern"
                  value={formData.smokingPattern}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  label="Thói quen hút thuốc"
                >
                  <MenuItem value="">Chọn thói quen</MenuItem>
                  <MenuItem value="Sáng sớm">Sáng sớm</MenuItem>
                  <MenuItem value="Sau bữa ăn">Sau bữa ăn</MenuItem>
                  <MenuItem value="Khi căng thẳng">Khi căng thẳng</MenuItem>
                  <MenuItem value="Buổi tối">Buổi tối</MenuItem>
                  <MenuItem value="Cả ngày">Cả ngày</MenuItem>
                  <MenuItem value="Cuối tuần">Chỉ cuối tuần</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tình huống kích thích hút thuốc"
                name="smokingTriggers"
                value={formData.smokingTriggers}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                multiline
                rows={2}
                placeholder="Ví dụ: căng thẳng, uống cà phê, gặp bạn bè, sau bữa ăn..."
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Display */}
        {(memberProfile?.memberId || Object.keys(memberProfile || {}).length > 0) && (
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
              📊 Thống kê chi phí
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Chi phí hàng ngày</Typography>
                <Typography variant="h6" color="error">
                  {Math.round((formData.dailyCigarettes / formData.cigarettesPerPack) * formData.packPrice).toLocaleString('vi-VN')} VND
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Chi phí hàng tháng</Typography>
                <Typography variant="h6" color="error">
                  {Math.round((formData.dailyCigarettes / formData.cigarettesPerPack) * formData.packPrice * 30).toLocaleString('vi-VN')} VND
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="success"
              startIcon={<span>💾</span>}
            >
              Lưu thay đổi
            </Button>
            <Button 
              type="button" 
              variant="outlined"
              onClick={handleCancel}
              startIcon={<span>❌</span>}
            >
              Hủy
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
}