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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../../api/axios";

export default function SmokingHabitsTab({ memberProfile, setMemberProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [triggerFactors, setTriggerFactors] = useState([]);
  const [isAddingTrigger, setIsAddingTrigger] = useState(false);
  const [newTriggerName, setNewTriggerName] = useState('');
  const [formData, setFormData] = useState({
    cigarettesSmoked: memberProfile?.cigarettesSmoked || 0,
    quitAttempts: memberProfile?.quitAttempts || 0,
    experienceLevel: memberProfile?.experienceLevel || 0, // Ensure it's never undefined
    personalMotivation: memberProfile?.personalMotivation || '',
    health: memberProfile?.health || '',
    pricePerPack: memberProfile?.pricePerPack || 25000,
    cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
  });

  // Fetch trigger factors on component mount
  useEffect(() => {
    fetchTriggerFactors();
  }, []);

  // Update form data when memberProfile changes
  useEffect(() => {
    if (memberProfile) {
      setFormData({
        cigarettesSmoked: memberProfile.cigarettesSmoked || 0,
        quitAttempts: memberProfile.quitAttempts || 0,
        experienceLevel: memberProfile.experienceLevel || 0, // Ensure it's never undefined
        personalMotivation: memberProfile.personalMotivation || '',
        health: memberProfile.health || '',
        pricePerPack: memberProfile.pricePerPack || 25000,
        cigarettesPerPack: memberProfile.cigarettesPerPack || 20,
      });
    }
  }, [memberProfile]);

  const fetchTriggerFactors = async () => {
    try {
      console.log('Fetching trigger factors...');
      // Remove /api prefix as the 404 error suggests it's not needed
      const response = await api.get('/TriggerFactor/Get-MyTriggerFactor');
      console.log('Trigger factors response:', response.data);
      setTriggerFactors(response.data || []);
    } catch (error) {
      console.error('Error fetching trigger factors:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Không thể tải danh sách yếu tố kích thích: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddTrigger = async () => {
    if (!newTriggerName.trim()) {
      toast.error('Vui lòng nhập tên yếu tố kích thích');
      return;
    }

    try {
      // Create the trigger factor - remove /api prefix
      const createResponse = await api.post('/TriggerFactor/Create-TriggerFactor', {
        name: newTriggerName.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberTriggers: [] // Initialize as empty array as per API structure
      });
      
      console.log('Create response:', createResponse.data);
      
      // The API might return the created trigger factor directly
      if (createResponse.data) {
        // Extract triggerId from response (could be nested in different places)
        const triggerId = createResponse.data.triggerId || createResponse.data.id;
        
        if (triggerId) {
          try {
            // Assign trigger to current member - remove /api prefix
            await api.post('/TriggerFactor/assign', [triggerId]);
            await fetchTriggerFactors(); // Refresh the list
            setNewTriggerName('');
            setIsAddingTrigger(false);
            toast.success('Đã thêm và gán yếu tố kích thích mới');
          } catch (assignError) {
            console.error('Error assigning trigger factor:', assignError);
            toast.error('Đã tạo yếu tố nhưng không thể gán cho bạn. Vui lòng thử lại.');
          }
        } else {
          console.error('No triggerId found in response:', createResponse.data);
          toast.error('Không thể lấy ID của yếu tố vừa tạo');
        }
      }
    } catch (error) {
      console.error('Error adding trigger factor:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Không thể thêm yếu tố kích thích');
    }
  };

  const handleDeleteTrigger = async (triggerId) => {
    try {
      // Remove trigger factor from member - remove /api prefix
      await api.delete(`/TriggerFactor/removeTriggerFactorAtMember/${triggerId}`);
      setTriggerFactors(prev => prev.filter(trigger => trigger.triggerId !== triggerId));
      toast.success('Đã xóa yếu tố kích thích khỏi danh sách của bạn');
    } catch (error) {
      console.error('Error removing trigger factor:', error);
      toast.error('Không thể xóa yếu tố kích thích');
    }
  };

  const handleUpdateTrigger = async (triggerId, updatedData) => {
    try {
      const updatePayload = {
        triggerId: triggerId,
        name: updatedData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Remove /api prefix
      await api.put(`/TriggerFactor/Update-TriggerFactor/${triggerId}`, updatePayload);
      await fetchTriggerFactors(); // Refresh the list
      toast.success('Đã cập nhật yếu tố kích thích');
    } catch (error) {
      console.error('Error updating trigger factor:', error);
      toast.error('Không thể cập nhật yếu tố kích thích');
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
    
    try {
      console.log('Submitting member profile update...');
      let updateData = {
        cigarettesSmoked: parseInt(formData.cigarettesSmoked) || 0,
        quitAttempts: parseInt(formData.quitAttempts) || 0,
        experienceLevel: parseInt(formData.experienceLevel) || 0,
        personalMotivation: formData.personalMotivation || '',
        health: formData.health || memberProfile?.health || '',
        pricePerPack: parseInt(formData.pricePerPack) || 25000,
        cigarettesPerPack: parseInt(formData.cigarettesPerPack) || 20,
        updatedAt: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      if (memberProfile?.memberId) {
        // Update existing member profile using the correct API endpoint
        console.log('Updating existing profile for member:', memberProfile.memberId);
        const response = await api.put('/MemberProfile/UpdateMyMemberProfile', updateData);
        console.log('Update response:', response.data);
        
        // API returns appointment data, so we need to merge properly
        const updatedProfile = { ...memberProfile, ...updateData };
        setMemberProfile(updatedProfile);
      } else {
        // Create new member profile using the correct API endpoint
        console.log('Creating new member profile...');
        const createData = {
          ...updateData,
          create: new Date().toISOString()
        };
        const response = await api.post('/MemberProfile/CreateMyMemberProfile', createData);
        console.log('Create response:', response.data);
        setMemberProfile(response.data);
      }
      
      setIsEditing(false);
      toast.success("Đã cập nhật thông tin sức khỏe và thói quen hút thuốc thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật hồ sơ:", err);
      console.error("Error details:", err.response?.data);
      toast.error(err.response?.data?.message || "Cập nhật hồ sơ thất bại!");
    }
  };

  const handleCancel = () => {
    setFormData({
      cigarettesSmoked: memberProfile?.cigarettesSmoked || 0,
      quitAttempts: memberProfile?.quitAttempts || 0,
      experienceLevel: memberProfile?.experienceLevel || 0,
      personalMotivation: memberProfile?.personalMotivation || '',
      health: memberProfile?.health || '',
      pricePerPack: memberProfile?.pricePerPack || 25000,
      cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
    });
    setIsEditing(false);
    setIsAddingTrigger(false);
    setNewTriggerName('');
    fetchTriggerFactors(); // Refresh trigger factors to original state
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
          🚬💚 Sức khỏe & Thói quen hút thuốc
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
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#2196f3', 
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            📋 Thông tin cơ bản
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel 
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                >
                  Tình trạng hút thuốc
                </InputLabel>
                <Select
                  name="smokingStatus"
                  value={formData.smokingStatus}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  label="Tình trạng hút thuốc"
                  sx={{ 
                    '& .MuiSelect-select': {
                      fontSize: '1rem'
                    }
                  }}
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
                variant="outlined"
                inputProps={{ min: 0 }}
                InputLabelProps={{
                  sx: { 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1rem'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel 
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                >
                  Mức độ kinh nghiệm
                </InputLabel>
                <Select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  label="Mức độ kinh nghiệm"
                  sx={{ 
                    '& .MuiSelect-select': {
                      fontSize: '1rem'
                    }
                  }}
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
                variant="outlined"
                multiline
                rows={3}
                placeholder="Mô tả các lần cai thuốc trước đây, nguyên nhân thất bại, bài học kinh nghiệm..."
                InputLabelProps={{
                  sx: { 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1rem'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Smoking Habits Details */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#2196f3', 
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            🚬 Thói quen hút thuốc
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điếu thuốc mỗi ngày"
                name="cigarettesSmoked"
                type="number"
                value={formData.cigarettesSmoked}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, max: 100 }}
                InputLabelProps={{
                  sx: { 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1rem'
                  }
                }}
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
                variant="outlined"
                inputProps={{ min: 0, max: 100 }}
                InputLabelProps={{
                  sx: { 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1rem'
                  }
                }}
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
                variant="outlined"
                inputProps={{ min: 1, max: 50 }}
                InputLabelProps={{
                  sx: { 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1rem'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giá tiền 1 gói thuốc (VND)"
                name="pricePerPack"
                type="number"
                value={formData.pricePerPack}
                onChange={handleFormChange}
                disabled={!isEditing}
                fullWidth
                variant="outlined"
                inputProps={{ min: 1000, step: 1000 }}
                InputLabelProps={{
                  sx: { 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1rem'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel 
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                >
                  Thói quen hút thuốc
                </InputLabel>
                <Select
                  name="smokingPattern"
                  value={formData.smokingPattern}
                  onChange={handleFormChange}
                  disabled={!isEditing}
                  label="Thói quen hút thuốc"
                  sx={{ 
                    '& .MuiSelect-select': {
                      fontSize: '1rem'
                    }
                  }}
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
          </Grid>
        </Paper>

        {/* Trigger Factors Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2196f3', 
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              🎯 Yếu tố kích thích hút thuốc
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setIsAddingTrigger(true)}
              disabled={!isEditing}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              Thêm yếu tố
            </Button>
          </Box>
          
          {triggerFactors.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {triggerFactors.map((trigger) => (
                <Chip
                  key={trigger.triggerId}
                  label={trigger.name}
                  variant="outlined"
                  color="primary"
                  deleteIcon={isEditing ? <DeleteIcon /> : null}
                  onDelete={isEditing ? () => handleDeleteTrigger(trigger.triggerId) : undefined}
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography 
              color="textSecondary" 
              sx={{ 
                fontStyle: 'italic',
                fontSize: '1rem'
              }}
            >
              Chưa có yếu tố kích thích nào. Hãy thêm các tình huống thường khiến bạn muốn hút thuốc.
            </Typography>
          )}
        </Paper>

        {/* Health Information Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#4caf50', 
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            💚 Thông tin sức khỏe
          </Typography>
          <TextField
            label="Tình trạng sức khỏe hiện tại"
            name="health"
            value={formData.health}
            onChange={handleFormChange}
            disabled={!isEditing}
            fullWidth
            multiline
            rows={4}
            placeholder="Mô tả tình trạng sức khỏe hiện tại của bạn: các vấn đề về hô hấp, tim mạch, hoặc các tác động khác của việc hút thuốc..."
            InputLabelProps={{
              sx: { 
                fontSize: '1rem',
                fontWeight: 500,
                color: '#333'
              }
            }}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '1rem'
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: isEditing ? 'white' : '#f5f5f5',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: isEditing ? '0 4px 12px rgba(76, 175, 80, 0.15)' : 'none',
                }
              }
            }}
          />
        </Paper>

        {/* Motivation Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#2196f3', 
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            💪 Động lực cai thuốc
          </Typography>
          <TextField
            label="Động lực cá nhân"
            name="personalMotivation"
            value={formData.personalMotivation}
            onChange={handleFormChange}
            disabled={!isEditing}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            placeholder="Chia sẻ lý do bạn muốn cai thuốc: sức khỏe, gia đình, tài chính, hình ảnh bản thân..."
            InputLabelProps={{
              sx: { 
                fontSize: '1rem',
                fontWeight: 500,
                color: '#333'
              }
            }}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '1rem'
              }
            }}
          />
        </Paper>

        {/* Add Trigger Dialog */}
        <Dialog open={isAddingTrigger} onClose={() => setIsAddingTrigger(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            Thêm yếu tố kích thích mới
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Tên yếu tố kích thích"
              fullWidth
              variant="outlined"
              value={newTriggerName}
              onChange={(e) => setNewTriggerName(e.target.value)}
              placeholder="Ví dụ: Căng thẳng, Uống cà phê, Gặp bạn bè..."
              sx={{ mt: 1 }}
              InputLabelProps={{
                sx: { 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#333'
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setIsAddingTrigger(false)}
              sx={{ fontSize: '1rem' }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleAddTrigger} 
              variant="contained"
              sx={{ fontSize: '1rem' }}
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Summary Section - Display only when not editing */}
        {!isEditing && memberProfile && (
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8fffe', border: '1px solid #e0f2f1' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', fontWeight: 'bold' }}>
              📋 Tóm tắt thông tin
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Số điếu thuốc/ngày:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {memberProfile.cigarettesSmoked || 0} điếu
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Số lần cai thuốc:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {memberProfile.quitAttempts || 0} lần
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Giá/gói thuốc:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {memberProfile.pricePerPack?.toLocaleString('vi-VN') || 0}₫
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Số điếu/gói:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {memberProfile.cigarettesPerPack || 0} điếu
                  </Typography>
                </Box>
              </Grid>
              {memberProfile.health && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                      Tình trạng sức khỏe:
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      backgroundColor: '#fff', 
                      p: 2, 
                      borderRadius: 1, 
                      border: '1px solid #e0e0e0',
                      mt: 1
                    }}>
                      {memberProfile.health}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {memberProfile.personalMotivation && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                      Động lực cai thuốc:
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      backgroundColor: '#fff', 
                      p: 2, 
                      borderRadius: 1, 
                      border: '1px solid #e0e0e0',
                      mt: 1
                    }}>
                      {memberProfile.personalMotivation}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {triggerFactors.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                      Yếu tố kích thích hút thuốc:
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#fff', 
                      p: 2, 
                      borderRadius: 1, 
                      border: '1px solid #e0e0e0',
                      mt: 1,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      {triggerFactors.map((trigger) => (
                        <Chip
                          key={trigger.triggerId}
                          label={trigger.name}
                          variant="outlined"
                          color="warning"
                          size="small"
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            '& .MuiChip-label': {
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              )}
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