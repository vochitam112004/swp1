import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon 
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const NOTIFICATION_TYPES = {
  MOTIVATION: 'motivation',
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement',
  HEALTH: 'health',
  MILESTONE: 'milestone'
};

const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Một lần' },
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' }
];

const MOTIVATION_MESSAGES = [
  "Bạn đang làm rất tốt! Hãy tiếp tục phấn đấu! 💪",
  "Mỗi ngày không thuốc lá là một chiến thắng! 🏆",
  "Hãy nhớ lý do bạn bắt đầu hành trình này! ❤️",
  "Sức khỏe của bạn đang được cải thiện từng ngày! 🌟",
  "Bạn mạnh mẽ hơn cơn thèm thuốc! 💯",
  "Tiền bạn tiết kiệm có thể mua những thứ ý nghĩa hơn! 💰",
  "Gia đình và bạn bè đang tự hào về bạn! 👨‍👩‍👧‍👦"
];

const HEALTH_TIPS = [
  "Uống nhiều nước để giải độc cơ thể",
  "Tập thể dục để giảm căng thẳng",
  "Ăn nhiều rau xanh và trái cây",
  "Ngủ đủ giấc để phục hồi sức khỏe",
  "Thực hiện bài tập thở sâu khi thèm thuốc"
];

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('customNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationHistory, setNotificationHistory] = useState(() => {
    const saved = localStorage.getItem('notificationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: NOTIFICATION_TYPES.MOTIVATION,
    frequency: 'daily',
    time: '09:00',
    isActive: true,
    days: [], // for weekly notifications
    date: '', // for one-time notifications
    customReason: '' // personal motivation
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      enableBrowserNotifications: true,
      enableMotivationMessages: true,
      enableHealthTips: true,
      enableMilestoneNotifications: true,
      morningTime: '08:00',
      eveningTime: '20:00'
    };
  });

  useEffect(() => {
    localStorage.setItem('customNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
  }, [notificationHistory]);

  // Request notification permission
  useEffect(() => {
    if (settings.enableBrowserNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [settings.enableBrowserNotifications]);

  // Set up notification intervals
  useEffect(() => {
    const intervals = [];

    notifications.forEach(notification => {
      if (!notification.isActive) return;

      const now = new Date();
      const [hours, minutes] = notification.time.split(':');
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      if (notification.frequency === 'daily') {
        const interval = setInterval(() => {
          sendNotification(notification);
          logNotification(notification);
        }, 24 * 60 * 60 * 1000); // 24 hours

        // Send first notification
        setTimeout(() => {
          sendNotification(notification);
          logNotification(notification);
        }, timeUntilNotification);

        intervals.push(interval);
      } else if (notification.frequency === 'weekly') {
        // Weekly notifications logic
        const interval = setInterval(() => {
          const today = new Date().getDay();
          if (notification.days.includes(today)) {
            sendNotification(notification);
            logNotification(notification);
          }
        }, 24 * 60 * 60 * 1000);

        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [notifications]);

  const sendNotification = (notification) => {
    if (settings.enableBrowserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
    toast.info(`${notification.title}: ${notification.message}`);
  };

  const logNotification = (notification) => {
    const log = {
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotificationHistory(prev => [log, ...prev.slice(0, 49)]); // Keep last 50
  };

  const handleSaveNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
      return;
    }

    const notification = {
      ...newNotification,
      id: editingNotification?.id || Date.now(),
      createdAt: editingNotification?.createdAt || new Date().toISOString()
    };

    if (editingNotification) {
      setNotifications(prev => 
        prev.map(n => n.id === editingNotification.id ? notification : n)
      );
      toast.success('Đã cập nhật thông báo!');
    } else {
      setNotifications(prev => [...prev, notification]);
      toast.success('Đã tạo thông báo mới!');
    }

    setNewNotification({
      title: '',
      message: '',
      type: NOTIFICATION_TYPES.MOTIVATION,
      frequency: 'daily',
      time: '09:00',
      isActive: true,
      days: [],
      date: '',
      customReason: ''
    });
    setEditingNotification(null);
    setOpenDialog(false);
  };

  const handleEditNotification = (notification) => {
    setNewNotification(notification);
    setEditingNotification(notification);
    setOpenDialog(true);
  };

  const handleDeleteNotification = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Đã xóa thông báo!');
    }
  };

  const generateMotivationMessage = () => {
    const userPlan = JSON.parse(localStorage.getItem('quitPlan') || '{}');
    const progress = JSON.parse(localStorage.getItem('quitProgress') || '{}');
    
    let message = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
    
    if (userPlan.reason) {
      message += ` Hãy nhớ: ${userPlan.reason}`;
    }
    
    if (progress.daysNoSmoke > 0) {
      message += ` Bạn đã không hút thuốc được ${progress.daysNoSmoke} ngày!`;
    }
    
    return message;
  };

  const createQuickNotification = (type) => {
    let title, message;
    
    switch (type) {
      case 'motivation':
        title = 'Động viên cai thuốc';
        message = generateMotivationMessage();
        break;
      case 'health':
        title = 'Lời khuyên sức khỏe';
        message = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
        break;
      case 'reminder':
        title = 'Nhắc nhở hàng ngày';
        message = 'Đừng quên cập nhật tiến trình cai thuốc hôm nay!';
        break;
      default:
        return;
    }

    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      frequency: 'daily',
      time: new Date().toTimeString().slice(0, 5),
      isActive: true,
      days: [],
      date: '',
      customReason: '',
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [...prev, notification]);
    toast.success('Đã tạo thông báo nhanh!');
  };

  const markAsRead = (id) => {
    setNotificationHistory(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notificationHistory.filter(n => !n.read).length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Hệ thống thông báo thông minh
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tạo và quản lý thông báo nhắc nhở, động viên để hỗ trợ hành trình cai thuốc của bạn.
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tạo nhanh thông báo
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                onClick={() => createQuickNotification('motivation')}
                startIcon={<NotificationsIcon />}
              >
                Động viên
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => createQuickNotification('health')}
                startIcon={<NotificationsIcon />}
              >
                Sức khỏe
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => createQuickNotification('reminder')}
                startIcon={<NotificationsIcon />}
              >
                Nhắc nhở
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setOpenDialog(true)}
                startIcon={<NotificationsIcon />}
              >
                Tạo thông báo tùy chỉnh
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cài đặt thông báo
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableBrowserNotifications}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      enableBrowserNotifications: e.target.checked
                    }))}
                  />
                }
                label="Bật thông báo trình duyệt"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableMotivationMessages}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      enableMotivationMessages: e.target.checked
                    }))}
                  />
                }
                label="Tin nhắn động viên"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableHealthTips}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      enableHealthTips: e.target.checked
                    }))}
                  />
                }
                label="Lời khuyên sức khỏe"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableMilestoneNotifications}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      enableMilestoneNotifications: e.target.checked
                    }))}
                  />
                }
                label="Thông báo cột mốc"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Active Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông báo đang hoạt động ({notifications.filter(n => n.isActive).length})
            </Typography>
            {notifications.length === 0 ? (
              <Alert severity="info">Chưa có thông báo nào được tạo.</Alert>
            ) : (
              <List>
                {notifications.slice(0, 5).map((notification) => (
                  <ListItem key={notification.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <ScheduleIcon color={notification.isActive ? 'primary' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message.slice(0, 50)}...
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={notification.frequency} 
                              size="small" 
                              sx={{ mr: 1 }} 
                            />
                            <Chip 
                              label={notification.time} 
                              size="small" 
                              variant="outlined" 
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditNotification(notification)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Notification History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lịch sử thông báo 
              {unreadCount > 0 && (
                <Chip label={`${unreadCount} chưa đọc`} color="error" size="small" sx={{ ml: 1 }} />
              )}
            </Typography>
            {notificationHistory.length === 0 ? (
              <Alert severity="info">Chưa có lịch sử thông báo.</Alert>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {notificationHistory.slice(0, 20).map((notification) => (
                  <ListItem 
                    key={notification.id} 
                    sx={{ 
                      px: 0,
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {new Date(notification.timestamp).toLocaleString('vi-VN')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Create/Edit Notification Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Nội dung thông báo"
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Loại thông báo</InputLabel>
                <Select
                  value={newNotification.type}
                  label="Loại thông báo"
                  onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value={NOTIFICATION_TYPES.MOTIVATION}>Động viên</MenuItem>
                  <MenuItem value={NOTIFICATION_TYPES.REMINDER}>Nhắc nhở</MenuItem>
                  <MenuItem value={NOTIFICATION_TYPES.HEALTH}>Sức khỏe</MenuItem>
                  <MenuItem value={NOTIFICATION_TYPES.MILESTONE}>Cột mốc</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tần suất</InputLabel>
                <Select
                  value={newNotification.frequency}
                  label="Tần suất"
                  onChange={(e) => setNewNotification(prev => ({ ...prev, frequency: e.target.value }))}
                >
                  {FREQUENCY_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Thời gian"
                value={newNotification.time}
                onChange={(e) => setNewNotification(prev => ({ ...prev, time: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newNotification.isActive}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Kích hoạt"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveNotification} variant="contained">
            {editingNotification ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
