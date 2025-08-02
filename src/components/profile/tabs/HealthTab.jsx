import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../api/axios";

export default function HealthTab({ memberProfile, setMemberProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    healthConditions: memberProfile?.healthConditions || '',
    allergies: memberProfile?.allergies || '',
    medications: memberProfile?.medications || '',
    previousHealthIssues: memberProfile?.previousHealthIssues || '',
  });

  // Update form data when memberProfile changes
  useEffect(() => {
    if (memberProfile) {
      setFormData({
        healthConditions: memberProfile.healthConditions || '',
        allergies: memberProfile.allergies || '',
        medications: memberProfile.medications || '',
        previousHealthIssues: memberProfile.previousHealthIssues || '',
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
    
    if (!memberProfile?.memberId) {
      toast.error("Không tìm thấy thông tin hồ sơ!");
      return;
    }

    try {
      const updateData = {
        memberId: memberProfile.memberId,
        healthConditions: formData.healthConditions,
        allergies: formData.allergies,
        medications: formData.medications,
        previousHealthIssues: formData.previousHealthIssues,
        // Keep existing smoking data
        smokingStatus: memberProfile.smokingStatus,
        quitAttempts: memberProfile.quitAttempts,
        experienceLevel: memberProfile.experienceLevel,
        previousAttempts: memberProfile.previousAttempts,
        dailyCigarettes: memberProfile.dailyCigarettes,
        yearsOfSmoking: memberProfile.yearsOfSmoking,
        packPrice: memberProfile.packPrice,
        cigarettesPerPack: memberProfile.cigarettesPerPack,
        smokingTriggers: memberProfile.smokingTriggers,
        preferredBrand: memberProfile.preferredBrand,
        smokingPattern: memberProfile.smokingPattern,
      };

      await api.put(`/MemberProfile/${memberProfile.memberId}`, updateData);
      
      setMemberProfile({ ...memberProfile, ...updateData });
      setIsEditing(false);
      toast.success("Đã cập nhật thông tin sức khỏe thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật thông tin sức khỏe:", err);
      toast.error(err.response?.data?.message || "Cập nhật thông tin sức khỏe thất bại!");
    }
  };

  const handleCancel = () => {
    setFormData({
      healthConditions: memberProfile?.healthConditions || '',
      allergies: memberProfile?.allergies || '',
      medications: memberProfile?.medications || '',
      previousHealthIssues: memberProfile?.previousHealthIssues || '',
    });
    setIsEditing(false);
  };

  if (!memberProfile) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
          🏥 Chưa có thông tin sức khỏe
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
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
          🏥 Thông tin sức khỏe
        </Typography>
        {!isEditing && (
          <Button 
            variant="contained"
            color="success"
            onClick={() => setIsEditing(true)}
            startIcon={<span>✏️</span>}
          >
            Chỉnh sửa
          </Button>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#4caf50' }}>
            💚 Thông tin sức khỏe chi tiết
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Tình trạng sức khỏe hiện tại"
                name="healthConditions"
                value={formData.healthConditions}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                multiline
                rows={3}
                placeholder="Mô tả tình trạng sức khỏe hiện tại..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isEditing ? 'white' : '#f5f5f5',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: isEditing ? '0 4px 12px rgba(76, 175, 80, 0.15)' : 'none',
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dị ứng"
                name="allergies"
                value={formData.allergies}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                placeholder="Dị ứng thuốc, thực phẩm..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isEditing ? 'white' : '#f5f5f5',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: isEditing ? '0 4px 12px rgba(76, 175, 80, 0.15)' : 'none',
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Thuốc đang sử dụng"
                name="medications"
                value={formData.medications}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                placeholder="Thuốc đang điều trị..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isEditing ? 'white' : '#f5f5f5',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: isEditing ? '0 4px 12px rgba(76, 175, 80, 0.15)' : 'none',
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Vấn đề sức khỏe do hút thuốc"
                name="previousHealthIssues"
                value={formData.previousHealthIssues}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                multiline
                rows={3}
                placeholder="Các vấn đề sức khỏe đã gặp do hút thuốc..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isEditing ? 'white' : '#f5f5f5',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: isEditing ? '0 4px 12px rgba(76, 175, 80, 0.15)' : 'none',
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Health Summary - Display only */}
        {!isEditing && memberProfile && (
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#e8f5e8', border: '1px solid #c8e6c9' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
              📋 Tóm tắt thông tin sức khỏe
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Tình trạng sức khỏe:
                  </Typography>
                  <Typography variant="body1">
                    {memberProfile.healthConditions || "Chưa có thông tin"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Dị ứng:
                  </Typography>
                  <Typography variant="body1">
                    {memberProfile.allergies || "Không có"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Thuốc đang sử dụng:
                  </Typography>
                  <Typography variant="body1">
                    {memberProfile.medications || "Không có"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Vấn đề sức khỏe do hút thuốc:
                  </Typography>
                  <Typography variant="body1">
                    {memberProfile.previousHealthIssues || "Chưa có thông tin"}
                  </Typography>
                </Box>
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
              sx={{
                borderRadius: '25px',
                padding: '12px 32px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                }
              }}
            >
              Lưu thay đổi
            </Button>
            <Button 
              type="button" 
              variant="outlined"
              color="error"
              onClick={handleCancel}
              startIcon={<span>❌</span>}
              sx={{
                borderRadius: '25px',
                padding: '12px 32px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Hủy
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
}
