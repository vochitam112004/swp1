import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  IconButton
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import api from "../../api/axios";
import { ApiErrorHandler } from "../../utils/ApiErrorHandler";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UnifiedProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [membershipHistory, setMembershipHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({
    account: false,
    smoking: false,
    health: false
  });
  
  // Form states
  const [accountForm, setAccountForm] = useState({});
  const [smokingForm, setSmokingForm] = useState({
    smokingStatus: '',
    cigarettesSmoked: 0,
    yearsOfSmoking: 0,
    pricePerPack: 25000,
    cigarettesPerPack: 20,
    smokingPattern: '',
    smokingTriggers: '',
    quitAttempts: 0,
    experienceLevel: 0,
    previousAttempts: '',
    personalMotivation: ''
  });
  const [healthForm, setHealthForm] = useState({
    health: ''
  });

  // Unified fetch function - eliminates duplication
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // First fetch user profile
        await fetchUserProfile();
        
      } catch (error) {
        ApiErrorHandler.handle(error, 'unified-profile-fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  // Separate effect for member data that depends on profile
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!profile || profile.userType !== "Member") return;

      try {
        const results = await Promise.allSettled([
          fetchMemberProfile(),
          fetchBadges(),
          fetchMembershipHistory()
        ]);

        // Handle results with proper error logging
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const context = ['member-profile', 'badges', 'membership'][index];
            ApiErrorHandler.handle(result.reason, context, false);
          }
        });

      } catch (error) {
        ApiErrorHandler.handle(error, 'member-data-fetch');
      }
    };

    if (profile && profile.userType === "Member") {
      fetchMemberData();
    }
  }, [profile]);

  const fetchUserProfile = async () => {
    const res = await api.get("/User");
    const userData = res.data;
    
    const mappedProfile = {
      username: userData.userName,
      displayName: userData.displayName,
      avatarUrl: userData.avatarUrl,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      userType: userData.userType,
      createdAt: userData.createdAt,
      isActive: userData.isActive,
    };
    
    setProfile(mappedProfile);
    setAccountForm(mappedProfile);
  };

  const fetchMemberProfile = async () => {
    try {
      const memberRes = await api.get("/api/MemberProfile/GetMyMemberProfile");
      const memberData = memberRes.data;
      setMemberProfile(memberData);
      
      // Initialize forms with member data
      setSmokingForm({
        smokingStatus: memberData.smokingStatus || '',
        cigarettesSmoked: memberData.cigarettesSmoked || 0,
        yearsOfSmoking: memberData.yearsOfSmoking || 0,
        pricePerPack: memberData.pricePerPack || 25000,
        cigarettesPerPack: memberData.cigarettesPerPack || 20,
        smokingPattern: memberData.smokingPattern || '',
        smokingTriggers: memberData.smokingTriggers || '',
        quitAttempts: memberData.quitAttempts || 0,
        experienceLevel: memberData.experienceLevel || 0,
        previousAttempts: memberData.previousAttempts || '',
        personalMotivation: memberData.personalMotivation || ''
      });
      
      setHealthForm({
        health: memberData.health || ''
      });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("ℹ️ Member profile not found - user can create one");
      } else {
        throw error;
      }
    }
  };

  const fetchBadges = async () => {
    try {
      const badgesRes = await api.get("/Badge/user-badges");
      setBadges(badgesRes.data || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
    }
  };

  const fetchMembershipHistory = async () => {
    try {
      const historyRes = await api.get("/MemberShip/membership-history");
      setMembershipHistory(historyRes.data || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
    }
  };

  const createMemberProfile = async () => {
    try {
      const defaultProfile = {
        ...smokingForm,
        ...healthForm
      };

      const response = await api.post('/MemberProfile', defaultProfile);
      setMemberProfile(response.data);
      toast.success("Đã tạo hồ sơ thành viên thành công!");
      return response.data;
    } catch (error) {
      ApiErrorHandler.handle(error, 'create-member-profile');
      throw error;
    }
  };

  // Unified save function
  const handleSave = async (section) => {
    try {
      switch (section) {
        case 'account':
          await api.put("/User", accountForm);
          setProfile(accountForm);
          toast.success("Đã cập nhật thông tin tài khoản!");
          break;
          
        case 'smoking':
          if (!memberProfile?.memberId) {
            await createMemberProfile();
            return;
          }
          await api.put(`/MemberProfile/${memberProfile.memberId}`, smokingForm);
          setMemberProfile({ ...memberProfile, ...smokingForm });
          toast.success("Đã cập nhật thông tin hút thuốc!");
          break;
          
        case 'health':
          if (!memberProfile?.memberId) {
            await createMemberProfile();
            return;
          }
          await api.put(`/MemberProfile/${memberProfile.memberId}`, healthForm);
          setMemberProfile({ ...memberProfile, ...healthForm });
          toast.success("Đã cập nhật thông tin sức khỏe!");
          break;
      }
      
      setIsEditing(prev => ({ ...prev, [section]: false }));
    } catch (error) {
      ApiErrorHandler.handle(error, `save-${section}`);
    }
  };

  const handleCancel = (section) => {
    switch (section) {
      case 'account':
        setAccountForm(profile);
        break;
      case 'smoking':
        setSmokingForm({
          smokingStatus: memberProfile?.smokingStatus || '',
          cigarettesSmoked: memberProfile?.cigarettesSmoked || 0,
          yearsOfSmoking: memberProfile?.yearsOfSmoking || 0,
          pricePerPack: memberProfile?.pricePerPack || 25000,
          cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
          smokingPattern: memberProfile?.smokingPattern || '',
          smokingTriggers: memberProfile?.smokingTriggers || '',
          quitAttempts: memberProfile?.quitAttempts || 0,
          experienceLevel: memberProfile?.experienceLevel || 0,
          previousAttempts: memberProfile?.previousAttempts || '',
          personalMotivation: memberProfile?.personalMotivation || ''
        });
        break;
      case 'health':
        setHealthForm({
          health: memberProfile?.health || ''
        });
        break;
    }
    setIsEditing(prev => ({ ...prev, [section]: false }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Đang tải thông tin...</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Không tìm thấy thông tin người dùng. Vui lòng thử lại sau.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Profile Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={profile.avatarUrl}
              sx={{ width: 100, height: 100, border: '4px solid white' }}
            >
              {profile.displayName?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              {profile.displayName || profile.username}
            </Typography>
            <Chip 
              label={profile.userType}
              color={profile.userType === 'Member' ? 'success' : 'default'}
              sx={{ mb: 1 }}
            />
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {profile.email}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="🏠 Thông tin tài khoản" />
            {profile?.userType === "Member" && (
              <>
                <Tab label="🚬 Thói quen hút thuốc" />
                <Tab label="❤️ Sức khỏe" />
                <Tab label="🏆 Huy hiệu & Lịch sử" />
              </>
            )}
          </Tabs>
        </Box>

        {/* Account Tab */}
        <TabPanel value={activeTab} index={0}>
          <AccountSection 
            profile={profile}
            form={accountForm}
            setForm={setAccountForm}
            isEditing={isEditing.account}
            onEdit={() => setIsEditing(prev => ({ ...prev, account: true }))}
            onSave={() => handleSave('account')}
            onCancel={() => handleCancel('account')}
          />
        </TabPanel>

        {/* Smoking Habits Tab */}
        {profile?.userType === "Member" && (
          <TabPanel value={activeTab} index={1}>
            <SmokingSection
              memberProfile={memberProfile}
              form={smokingForm}
              setForm={setSmokingForm}
              isEditing={isEditing.smoking}
              onEdit={() => setIsEditing(prev => ({ ...prev, smoking: true }))}
              onSave={() => handleSave('smoking')}
              onCancel={() => handleCancel('smoking')}
              onCreate={createMemberProfile}
            />
          </TabPanel>
        )}

        {/* Health Tab */}
        {profile?.userType === "Member" && (
          <TabPanel value={activeTab} index={2}>
            <HealthSection
              memberProfile={memberProfile}
              form={healthForm}
              setForm={setHealthForm}
              isEditing={isEditing.health}
              onEdit={() => setIsEditing(prev => ({ ...prev, health: true }))}
              onSave={() => handleSave('health')}
              onCancel={() => handleCancel('health')}
              onCreate={createMemberProfile}
            />
          </TabPanel>
        )}

        {/* Badges & History Tab */}
        {profile?.userType === "Member" && (
          <TabPanel value={activeTab} index={3}>
            <BadgesHistorySection 
              badges={badges}
              membershipHistory={membershipHistory}
              memberProfile={memberProfile}
            />
          </TabPanel>
        )}
      </Paper>
    </Box>
  );
}

// Account Section Component
function AccountSection({ profile, form, setForm, isEditing, onEdit, onSave, onCancel }) {
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          🏠 Thông tin tài khoản
        </Typography>
        {!isEditing ? (
          <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
            Chỉnh sửa
          </Button>
        ) : (
          <Box>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave} sx={{ mr: 1 }}>
              Lưu
            </Button>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancel}>
              Hủy
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tên hiển thị"
            name="displayName"
            value={form.displayName || ''}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={form.phoneNumber || ''}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Địa chỉ"
            name="address"
            value={form.address || ''}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// Smoking Section Component
function SmokingSection({ memberProfile, form, setForm, isEditing, onEdit, onSave, onCancel, onCreate }) {
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!memberProfile) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
          👤 Chưa có thông tin hồ sơ thành viên
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Hãy tạo hồ sơ thành viên để bắt đầu theo dõi thông tin hút thuốc
        </Typography>
        <Button variant="contained" onClick={onCreate} startIcon={<span>➕</span>}>
          Tạo hồ sơ thành viên
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          🚬 Thông tin hút thuốc
        </Typography>
        {!isEditing ? (
          <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
            Chỉnh sửa
          </Button>
        ) : (
          <Box>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave} sx={{ mr: 1 }}>
              Lưu
            </Button>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancel}>
              Hủy
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tình trạng hút thuốc</InputLabel>
            <Select
              name="smokingStatus"
              value={form.smokingStatus}
              onChange={handleChange}
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
            label="Số điếu thuốc/ngày"
            name="cigarettesSmoked"
            type="number"
            value={form.cigarettesSmoked}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Số năm hút thuốc"
            name="yearsOfSmoking"
            type="number"
            value={form.yearsOfSmoking}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Giá gói thuốc (VNĐ)"
            name="pricePerPack"
            type="number"
            value={form.pricePerPack}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Số điếu/gói"
            name="cigarettesPerPack"
            type="number"
            value={form.cigarettesPerPack}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nguyên nhân/Tác nhân gây hút thuốc"
            name="smokingTriggers"
            value={form.smokingTriggers}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// Health Section Component
function HealthSection({ memberProfile, form, setForm, isEditing, onEdit, onSave, onCancel, onCreate }) {
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!memberProfile) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
          👤 Chưa có thông tin hồ sơ thành viên
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Hãy tạo hồ sơ thành viên để bắt đầu theo dõi thông tin sức khỏe
        </Typography>
        <Button variant="contained" onClick={onCreate} startIcon={<span>➕</span>}>
          Tạo hồ sơ thành viên
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          ❤️ Thông tin sức khỏe
        </Typography>
        {!isEditing ? (
          <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
            Chỉnh sửa
          </Button>
        ) : (
          <Box>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave} sx={{ mr: 1 }}>
              Lưu
            </Button>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancel}>
              Hủy
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Tình trạng sức khỏe hiện tại"
            name="health"
            value={form.health}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            multiline
            rows={4}
            placeholder="Mô tả tình trạng sức khỏe hiện tại của bạn..."
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// Badges & History Section Component
function BadgesHistorySection({ badges, membershipHistory, memberProfile }) {
  // Calculate smoking costs
  const dailyCost = memberProfile ? 
    (memberProfile.cigarettesSmoked / memberProfile.cigarettesPerPack) * memberProfile.pricePerPack : 0;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
        🏆 Huy hiệu & Thống kê
      </Typography>

      {/* Smoking Cost Statistics */}
      {memberProfile && (
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            💰 Chi phí hút thuốc
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                  {dailyCost.toLocaleString()} ₫
                </Typography>
                <Typography color="textSecondary">Mỗi ngày</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {monthlyCost.toLocaleString()} ₫
                </Typography>
                <Typography color="textSecondary">Mỗi tháng</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                  {yearlyCost.toLocaleString()} ₫
                </Typography>
                <Typography color="textSecondary">Mỗi năm</Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Badges */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          🏆 Huy hiệu đã đạt được
        </Typography>
        {badges.length > 0 ? (
          <Grid container spacing={2}>
            {badges.map((badge, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {badge.icon || '🏆'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {badge.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {badge.description}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    Đạt được: {new Date(badge.earnedDate).toLocaleDateString('vi-VN')}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            Bạn chưa có huy hiệu nào. Hãy tích cực tham gia để nhận huy hiệu!
          </Alert>
        )}
      </Paper>

      {/* Membership History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          📊 Lịch sử thành viên
        </Typography>
        {membershipHistory.length > 0 ? (
          membershipHistory.map((item, index) => (
            <Card key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {item.membershipType}
                  </Typography>
                  <Typography color="textSecondary">
                    Từ: {new Date(item.startDate).toLocaleDateString('vi-VN')} 
                    {item.endDate && ` - Đến: ${new Date(item.endDate).toLocaleDateString('vi-VN')}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {(item.price || 0).toLocaleString()} ₫
                  </Typography>
                  <Chip 
                    label={item.endDate && new Date(item.endDate) < new Date() ? 'Đã hết hạn' : 'Đang hoạt động'}
                    color={item.endDate && new Date(item.endDate) < new Date() ? 'default' : 'success'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Card>
          ))
        ) : (
          <Alert severity="info">
            Bạn chưa có lịch sử thành viên nào.
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
