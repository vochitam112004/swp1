import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
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
  Alert
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const COMMON_TRIGGERS = [
  'Stress', 'Cà phê', 'Rượu bia', 'Sau ăn', 'Lái xe', 
  'Công việc', 'Bạn bè hút thuốc', 'Cô đơn', 'Buồn chán', 'Giận dữ'
];

const INTENSITY_LEVELS = [
  { value: 1, label: 'Rất nhẹ', color: '#4caf50' },
  { value: 2, label: 'Nhẹ', color: '#8bc34a' },
  { value: 3, label: 'Trung bình', color: '#ffeb3b' },
  { value: 4, label: 'Mạnh', color: '#ff9800' },
  { value: 5, label: 'Rất mạnh', color: '#f44336' }
];

export default function TriggerTracker() {
  const [triggers, setTriggers] = useState(() => {
    const saved = localStorage.getItem('smokingTriggers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newTrigger, setNewTrigger] = useState({
    name: '',
    intensity: 1,
    description: '',
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    location: '',
    emotion: '',
    copingStrategy: ''
  });

  const [selectedTrigger, setSelectedTrigger] = useState('');

  useEffect(() => {
    localStorage.setItem('smokingTriggers', JSON.stringify(triggers));
  }, [triggers]);

  const handleAddTrigger = () => {
    if (!newTrigger.name.trim()) {
      toast.error('Vui lòng chọn hoặc nhập tên trigger!');
      return;
    }

    const trigger = {
      ...newTrigger,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setTriggers(prev => [...prev, trigger]);
    setNewTrigger({
      name: '',
      intensity: 1,
      description: '',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      location: '',
      emotion: '',
      copingStrategy: ''
    });
    setOpenDialog(false);
    toast.success('Đã ghi nhận trigger thành công!');
  };

  const getTriggerStats = () => {
    const stats = {};
    triggers.forEach(trigger => {
      if (stats[trigger.name]) {
        stats[trigger.name].count++;
        stats[trigger.name].totalIntensity += trigger.intensity;
      } else {
        stats[trigger.name] = {
          count: 1,
          totalIntensity: trigger.intensity
        };
      }
    });
    
    return Object.entries(stats).map(([name, data]) => ({
      name,
      count: data.count,
      avgIntensity: (data.totalIntensity / data.count).toFixed(1)
    })).sort((a, b) => b.count - a.count);
  };

  const getRecentTriggers = () => {
    return triggers
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  };

  const getIntensityColor = (intensity) => {
    const level = INTENSITY_LEVELS.find(l => l.value === intensity);
    return level ? level.color : '#ccc';
  };

  const getAvoidanceStrategies = (triggerName) => {
    const strategies = {
      'Stress': [
        'Thực hiện bài tập thở sâu',
        'Tập thiền 5-10 phút',
        'Đi bộ hoặc tập thể dục nhẹ',
        'Nghe nhạc thư giãn'
      ],
      'Cà phê': [
        'Thay cà phê bằng trà thảo mộc',
        'Uống cà phê ở nơi không có khói thuốc',
        'Thay đổi thói quen uống cà phê',
        'Nhai kẹo cao su hoặc ăn kẹo'
      ],
      'Sau ăn': [
        'Đánh răng ngay sau khi ăn',
        'Uống nước hoặc trà',
        'Đi bộ nhẹ nhàng',
        'Nhai kẹo cao su'
      ],
      'Buồn chán': [
        'Tìm hoạt động thú vị khác',
        'Gọi điện cho bạn bè',
        'Đọc sách hoặc xem phim',
        'Tập thể dục'
      ]
    };
    return strategies[triggerName] || [
      'Thực hiện bài tập thở sâu',
      'Uống nước',
      'Chuyển hướng chú ý',
      'Tìm hoạt động thay thế'
    ];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Theo dõi Trigger - Yếu tố kích thích
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ghi nhận và phân tích các yếu tố khiến bạn muốn hút thuốc để có chiến lược phòng tránh phù hợp.
      </Typography>

      <Grid container spacing={3}>
        {/* Add Trigger Button */}
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 2 }}
          >
            + Ghi nhận Trigger mới
          </Button>
        </Grid>

        {/* Recent Triggers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trigger gần đây
            </Typography>
            {getRecentTriggers().length === 0 ? (
              <Alert severity="info">Chưa có trigger nào được ghi nhận.</Alert>
            ) : (
              getRecentTriggers().map((trigger) => (
                <Box key={trigger.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={trigger.name} 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`Mức độ: ${trigger.intensity}/5`}
                      sx={{ backgroundColor: getIntensityColor(trigger.intensity), color: 'white' }}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(trigger.timestamp).toLocaleString('vi-VN')}
                  </Typography>
                  {trigger.location && (
                    <Typography variant="body2">📍 {trigger.location}</Typography>
                  )}
                  {trigger.emotion && (
                    <Typography variant="body2">😊 {trigger.emotion}</Typography>
                  )}
                  {trigger.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {trigger.description}
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Trigger Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê Trigger
            </Typography>
            {getTriggerStats().length === 0 ? (
              <Alert severity="info">Chưa có dữ liệu thống kê.</Alert>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTriggerStats()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" name="Số lần" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Avoidance Strategies */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chiến lược phòng tránh
            </Typography>
            <FormControl sx={{ mb: 2, minWidth: 200 }}>
              <InputLabel>Chọn trigger</InputLabel>
              <Select
                value={selectedTrigger}
                label="Chọn trigger"
                onChange={(e) => setSelectedTrigger(e.target.value)}
              >
                {Array.from(new Set(triggers.map(t => t.name))).map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
                {COMMON_TRIGGERS.map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedTrigger && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Gợi ý cho trigger "{selectedTrigger}":
                </Typography>
                {getAvoidanceStrategies(selectedTrigger).map((strategy, index) => (
                  <Alert key={index} severity="success" sx={{ mb: 1 }}>
                    {strategy}
                  </Alert>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Trigger Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ghi nhận Trigger mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Chọn trigger</InputLabel>
                <Select
                  value={newTrigger.name}
                  label="Chọn trigger"
                  onChange={(e) => setNewTrigger(prev => ({ ...prev, name: e.target.value }))}
                >
                  {COMMON_TRIGGERS.map(trigger => (
                    <MenuItem key={trigger} value={trigger}>{trigger}</MenuItem>
                  ))}
                  <MenuItem value="other">Khác (nhập thủ công)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {newTrigger.name === 'other' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên trigger"
                  value={newTrigger.name === 'other' ? '' : newTrigger.name}
                  onChange={(e) => setNewTrigger(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
            )}

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Ngày"
                value={newTrigger.date}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Giờ"
                value={newTrigger.time}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, time: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Mức độ khao khát</InputLabel>
                <Select
                  value={newTrigger.intensity}
                  label="Mức độ khao khát"
                  onChange={(e) => setNewTrigger(prev => ({ ...prev, intensity: e.target.value }))}
                >
                  {INTENSITY_LEVELS.map(level => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.value} - {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Địa điểm"
                value={newTrigger.location}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ví dụ: Văn phòng, Quán cà phê..."
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cảm xúc lúc đó"
                value={newTrigger.emotion}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, emotion: e.target.value }))}
                placeholder="Ví dụ: Căng thẳng, Buồn chán..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả chi tiết"
                value={newTrigger.description}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả tình huống cụ thể..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Chiến lược đã áp dụng"
                value={newTrigger.copingStrategy}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, copingStrategy: e.target.value }))}
                placeholder="Bạn đã làm gì để đối phó với trigger này?"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleAddTrigger} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
