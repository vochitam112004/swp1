import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Alert, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  Divider,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import achievementService from '../../api/achievementService';

/**
 * Test component to verify the Achievement API functionality
 */
export default function AchievementAPITest() {
  const [templates, setTemplates] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [testUserId, setTestUserId] = useState(3); // Default test user ID
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    requiredSmokeFreeDays: 0,
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Test functions
  const testGetAllTemplates = async () => {
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const result = await achievementService.getAllTemplates();
      if (result.success) {
        setTemplates(result.templates);
        setSuccess(`✅ Lấy danh sách templates thành công! Có ${result.templates.length} templates.`);
      } else {
        setError(`❌ Lỗi API: ${result.error}`);
      }
    } catch (error) {
      setError(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateTemplate = async () => {
    if (!newTemplate.name.trim()) {
      setError('❌ Vui lòng nhập tên template!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const result = await achievementService.createTemplate(newTemplate);
      if (result.success) {
        setSuccess('✅ Tạo template thành công!');
        setNewTemplate({ name: '', requiredSmokeFreeDays: 0, description: '' });
        testGetAllTemplates(); // Refresh list
      } else {
        setError(`❌ Lỗi tạo template: ${result.error}`);
      }
    } catch (error) {
      setError(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetUserAchievements = async () => {
    if (!testUserId) {
      setError('❌ Vui lòng nhập User ID!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const result = await achievementService.getUserAchievements(testUserId);
      if (result.success) {
        setUserAchievements(result.achievements);
        setSuccess(`✅ Lấy thành tích user thành công! User có ${result.achievements.length} achievements.`);
      } else {
        setError(`❌ Lỗi API: ${result.error}`);
      }
    } catch (error) {
      setError(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAssignAchievement = async () => {
    if (!testUserId || !selectedTemplateId) {
      setError('❌ Vui lòng chọn User ID và Template!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const result = await achievementService.assignAchievement({
        userId: testUserId,
        templateId: parseInt(selectedTemplateId)
      });
      if (result.success) {
        setSuccess('✅ Gán achievement thành công!');
        testGetUserAchievements(); // Refresh user achievements
      } else {
        setError(`❌ Lỗi gán achievement: ${result.error}`);
      }
    } catch (error) {
      setError(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRemoveAchievement = async (templateId) => {
    if (!testUserId) {
      setError('❌ Vui lòng nhập User ID!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const result = await achievementService.removeUserAchievement(testUserId, templateId);
      if (result.success) {
        setSuccess('✅ Xóa achievement thành công!');
        testGetUserAchievements(); // Refresh user achievements
      } else {
        setError(`❌ Lỗi xóa achievement: ${result.error}`);
      }
    } catch (error) {
      setError(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto test when component mounts
  useEffect(() => {
    testGetAllTemplates();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🏆 Achievement API Test Suite
      </Typography>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Template Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📝 Template Management
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={testGetAllTemplates}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  🔄 Lấy danh sách Templates
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Tạo Template mới:
                </Typography>
                <TextField
                  label="Tên template"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Số ngày yêu cầu"
                  type="number"
                  value={newTemplate.requiredSmokeFreeDays}
                  onChange={(e) => setNewTemplate({...newTemplate, requiredSmokeFreeDays: parseInt(e.target.value) || 0})}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Mô tả"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={testCreateTemplate}
                  disabled={loading}
                  fullWidth
                >
                  ➕ Tạo Template
                </Button>
              </Box>

              {/* Templates List */}
              <Typography variant="subtitle2" gutterBottom>
                📋 Danh sách Templates ({templates.length}):
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {templates.map((template) => (
                  <Card key={template.templateId} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {template.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {template.templateId} | Yêu cầu: {template.requiredSmokeFreeDays} ngày
                    </Typography>
                    <Typography variant="caption" display="block">
                      {template.description}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User Achievement Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                👤 User Achievement Management
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="User ID để test"
                  type="number"
                  value={testUserId}
                  onChange={(e) => setTestUserId(parseInt(e.target.value) || '')}
                  size="small"
                  sx={{ mb: 2, mr: 1 }}
                />
                <Button 
                  variant="contained" 
                  onClick={testGetUserAchievements}
                  disabled={loading}
                  size="small"
                >
                  🔍 Xem Achievements
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Gán Achievement mới:
                </Typography>
                <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Chọn Template</InputLabel>
                  <Select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    label="Chọn Template"
                  >
                    {templates.map((template) => (
                      <MenuItem key={template.templateId} value={template.templateId}>
                        {template.name} ({template.requiredSmokeFreeDays} ngày)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  variant="outlined" 
                  onClick={testAssignAchievement}
                  disabled={loading}
                  fullWidth
                >
                  🎯 Gán Achievement
                </Button>
              </Box>

              {/* User Achievements List */}
              <Typography variant="subtitle2" gutterBottom>
                🏆 Achievements của User {testUserId} ({userAchievements.length}):
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {userAchievements.map((achievement) => (
                  <Card key={achievement.achievementId} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {achievement.template?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Yêu cầu: {achievement.template?.requiredSmokeFreeDays} ngày | 
                          Hiện tại: {achievement.smokeFreeDays} ngày
                        </Typography>
                        <br />
                        <Chip 
                          label={achievement.smokeFreeDays >= (achievement.template?.requiredSmokeFreeDays || 0) ? "Đã đạt" : "Chưa đạt"}
                          color={achievement.smokeFreeDays >= (achievement.template?.requiredSmokeFreeDays || 0) ? "success" : "warning"}
                          size="small"
                        />
                      </Box>
                      <Button 
                        size="small" 
                        color="error"
                        onClick={() => testRemoveAchievement(achievement.templateId)}
                        disabled={loading}
                      >
                        🗑️
                      </Button>
                    </Box>
                  </Card>
                ))}
                {userAchievements.length === 0 && (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                    Không có achievement nào
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* API Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📚 API Endpoints Information
              </Typography>
              <Box component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
{`🔗 Achievement Template APIs:
GET    /api/AchievementTemplate                    - Lấy tất cả templates
POST   /api/AchievementTemplate                    - Tạo template mới
PUT    /api/AchievementTemplate/{id}               - Cập nhật template
DELETE /api/AchievementTemplate/{id}               - Xóa template

🔗 User Achievement APIs:
GET    /api/UserAchievement/{userId}               - Lấy achievements của user
POST   /api/UserAchievement/assign                 - Gán achievement cho user
DELETE /api/UserAchievement/{userId}/{templateId}  - Xóa achievement khỏi user

📝 Template Object:
{
  "templateId": number,
  "name": string,
  "requiredSmokeFreeDays": number,
  "description": string
}

📝 User Achievement Object:
{
  "achievementId": number,
  "userId": number,
  "templateId": number,
  "smokeFreeDays": number,
  "lastUpdated": datetime,
  "template": TemplateObject,
  "user": UserObject
}`}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
