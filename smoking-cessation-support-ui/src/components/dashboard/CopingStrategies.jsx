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
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const TRIGGER_TYPES = [
  'Stress', 'Cà phê', 'Rượu bia', 'Sau ăn', 'Lái xe', 
  'Công việc', 'Bạn bè hút thuốc', 'Cô đơn', 'Buồn chán', 'Giận dữ'
];

const COPING_STRATEGIES = {
  'Stress': [
    { name: 'Thở sâu 4-7-8', duration: 5, description: 'Hít vào 4s, giữ 7s, thở ra 8s' },
    { name: 'Thiền chánh niệm', duration: 10, description: 'Tập trung vào hơi thở và cảm nhận hiện tại' },
    { name: 'Đi bộ thư giãn', duration: 15, description: 'Đi bộ chậm và quan sát xung quanh' },
    { name: 'Nghe nhạc thư giãn', duration: 20, description: 'Nghe nhạc cổ điển hoặc thiên nhiên' }
  ],
  'Cà phê': [
    { name: 'Thay thế đồ uống', duration: 2, description: 'Uống trà thảo mộc thay cà phê' },
    { name: 'Nhai kẹo cao su', duration: 5, description: 'Nhai kẹo không đường' },
    { name: 'Súc miệng', duration: 3, description: 'Súc miệng với nước lạnh' },
    { name: 'Ăn kẹo bạc hà', duration: 5, description: 'Ăn kẹo bạc hà để làm mới miệng' }
  ],
  'Sau ăn': [
    { name: 'Đánh răng ngay', duration: 3, description: 'Đánh răng và súc miệng' },
    { name: 'Uống nước ấm', duration: 5, description: 'Uống một cốc nước ấm' },
    { name: 'Đi bộ nhẹ', duration: 10, description: 'Đi bộ 5-10 phút sau ăn' },
    { name: 'Nhai kẹo cao su', duration: 10, description: 'Nhai kẹo không đường' }
  ],
  'Buồn chán': [
    { name: 'Đọc sách', duration: 30, description: 'Đọc vài trang sách yêu thích' },
    { name: 'Gọi điện bạn bè', duration: 15, description: 'Trò chuyện với người thân' },
    { name: 'Nghe podcast', duration: 20, description: 'Nghe podcast giáo dục hoặc giải trí' },
    { name: 'Làm puzzle', duration: 25, description: 'Giải sudoku hoặc crossword' }
  ],
  'default': [
    { name: 'Thở sâu', duration: 5, description: 'Thực hiện bài tập thở sâu' },
    { name: 'Uống nước', duration: 2, description: 'Uống một cốc nước lạnh' },
    { name: 'Chuyển hướng chú ý', duration: 10, description: 'Tập trung vào việc khác' },
    { name: 'Nhắc nhở lý do', duration: 3, description: 'Nhớ lại lý do cai thuốc' }
  ]
};

export default function CopingStrategies() {
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedStrategies, setCompletedStrategies] = useState(() => {
    const saved = localStorage.getItem('completedCopingStrategies');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [customStrategies, setCustomStrategies] = useState(() => {
    const saved = localStorage.getItem('customCopingStrategies');
    return saved ? JSON.parse(saved) : [];
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    duration: 5,
    description: '',
    trigger: 'default'
  });

  const [selectedTrigger, setSelectedTrigger] = useState('default');
  const [strategyStats, setStrategyStats] = useState(() => {
    const saved = localStorage.getItem('copingStrategyStats');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('completedCopingStrategies', JSON.stringify(completedStrategies));
  }, [completedStrategies]);

  useEffect(() => {
    localStorage.setItem('customCopingStrategies', JSON.stringify(customStrategies));
  }, [customStrategies]);

  useEffect(() => {
    localStorage.setItem('copingStrategyStats', JSON.stringify(strategyStats));
  }, [strategyStats]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (activeStrategy) {
        handleStrategyComplete(activeStrategy);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeStrategy]);

  const startStrategy = (strategy) => {
    setActiveStrategy(strategy);
    setTimeLeft(strategy.duration * 60); // Convert minutes to seconds
    setIsRunning(true);
    toast.info(`Bắt đầu: ${strategy.name}`);
  };

  const pauseStrategy = () => {
    setIsRunning(false);
    toast.info('Đã tạm dừng');
  };

  const resumeStrategy = () => {
    setIsRunning(true);
    toast.info('Tiếp tục');
  };

  const stopStrategy = () => {
    setIsRunning(false);
    setActiveStrategy(null);
    setTimeLeft(0);
    toast.info('Đã dừng');
  };

  const handleStrategyComplete = (strategy) => {
    const completion = {
      id: Date.now(),
      strategyName: strategy.name,
      trigger: selectedTrigger,
      completedAt: new Date().toISOString(),
      duration: strategy.duration
    };
    
    setCompletedStrategies(prev => [completion, ...prev.slice(0, 49)]); // Keep last 50
    
    // Update stats
    const statKey = strategy.name;
    setStrategyStats(prev => ({
      ...prev,
      [statKey]: {
        count: (prev[statKey]?.count || 0) + 1,
        totalDuration: (prev[statKey]?.totalDuration || 0) + strategy.duration
      }
    }));

    toast.success(`Hoàn thành: ${strategy.name}! 🎉`);
    setActiveStrategy(null);
    setTimeLeft(0);
  };

  const addCustomStrategy = () => {
    if (!newStrategy.name.trim()) {
      toast.error('Vui lòng nhập tên chiến lược!');
      return;
    }

    const strategy = {
      ...newStrategy,
      id: Date.now(),
      isCustom: true
    };

    setCustomStrategies(prev => [...prev, strategy]);
    setNewStrategy({
      name: '',
      duration: 5,
      description: '',
      trigger: 'default'
    });
    setOpenDialog(false);
    toast.success('Đã thêm chiến lược mới!');
  };

  const deleteCustomStrategy = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chiến lược này?')) {
      setCustomStrategies(prev => prev.filter(s => s.id !== id));
      toast.success('Đã xóa chiến lược!');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStrategiesForTrigger = (trigger) => {
    const defaultStrategies = COPING_STRATEGIES[trigger] || COPING_STRATEGIES.default;
    const customStrategiesForTrigger = customStrategies.filter(s => s.trigger === trigger);
    return [...defaultStrategies, ...customStrategiesForTrigger];
  };

  const getTopStrategies = () => {
    return Object.entries(strategyStats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5)
      .map(([name, stats]) => ({ name, ...stats }));
  };

  const getRecentCompletions = () => {
    return completedStrategies.slice(0, 5);
  };

  const getTotalCompletions = () => {
    return completedStrategies.length;
  };

  const getTotalTime = () => {
    return completedStrategies.reduce((total, completion) => total + completion.duration, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Chiến lược đối phó với cơn thèm thuốc
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Luyện tập các kỹ thuật đối phó hiệu quả để vượt qua cơn thèm thuốc và trigger.
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {getTotalCompletions()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lần thực hành
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {getTotalTime()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phút luyện tập
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {Object.keys(strategyStats).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chiến lược đã thử
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Strategy Timer */}
        {activeStrategy && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                Đang thực hiện: {activeStrategy.name}
              </Typography>
              <Typography variant="h3" sx={{ my: 2 }}>
                {formatTime(timeLeft)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {activeStrategy.description}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={((activeStrategy.duration * 60 - timeLeft) / (activeStrategy.duration * 60)) * 100}
                sx={{ mb: 2, bgcolor: 'primary.light', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {isRunning ? (
                  <Button variant="contained" color="warning" onClick={pauseStrategy} startIcon={<PauseIcon />}>
                    Tạm dừng
                  </Button>
                ) : (
                  <Button variant="contained" color="success" onClick={resumeStrategy} startIcon={<PlayIcon />}>
                    Tiếp tục
                  </Button>
                )}
                <Button variant="outlined" onClick={stopStrategy} startIcon={<StopIcon />} sx={{ color: 'white', borderColor: 'white' }}>
                  Dừng
                </Button>
                <Button variant="outlined" onClick={() => handleStrategyComplete(activeStrategy)} startIcon={<CheckIcon />} sx={{ color: 'white', borderColor: 'white' }}>
                  Hoàn thành
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Trigger Selection */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chọn trigger và chiến lược
            </Typography>
            
            <FormControl sx={{ mb: 2, minWidth: 200 }}>
              <InputLabel>Chọn trigger</InputLabel>
              <Select
                value={selectedTrigger}
                label="Chọn trigger"
                onChange={(e) => setSelectedTrigger(e.target.value)}
              >
                <MenuItem value="default">Chung</MenuItem>
                {TRIGGER_TYPES.map(trigger => (
                  <MenuItem key={trigger} value={trigger}>{trigger}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              variant="outlined" 
              onClick={() => setOpenDialog(true)}
              sx={{ ml: 2, mb: 2 }}
            >
              + Thêm chiến lược tùy chỉnh
            </Button>

            <Grid container spacing={2}>
              {getStrategiesForTrigger(selectedTrigger).map((strategy, index) => (
                <Grid item xs={12} sm={6} key={strategy.id || index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {strategy.name}
                        </Typography>
                        <Chip 
                          label={`${strategy.duration} phút`} 
                          size="small" 
                          icon={<TimerIcon />}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {strategy.description}
                      </Typography>
                      {strategyStats[strategy.name] && (
                        <Typography variant="caption" color="text.secondary">
                          Đã thực hiện {strategyStats[strategy.name].count} lần
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => startStrategy(strategy)}
                        disabled={activeStrategy !== null}
                        startIcon={<PlayIcon />}
                      >
                        Bắt đầu
                      </Button>
                      {strategy.isCustom && (
                        <IconButton 
                          size="small" 
                          onClick={() => deleteCustomStrategy(strategy.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Statistics and History */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top chiến lược
            </Typography>
            {getTopStrategies().length === 0 ? (
              <Alert severity="info">Chưa có dữ liệu thống kê.</Alert>
            ) : (
              <List dense>
                {getTopStrategies().map((strategy, index) => (
                  <ListItem key={strategy.name} sx={{ px: 0 }}>
                    <ListItemText
                      primary={strategy.name}
                      secondary={`${strategy.count} lần, ${strategy.totalDuration} phút`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lịch sử gần đây
            </Typography>
            {getRecentCompletions().length === 0 ? (
              <Alert severity="info">Chưa có lịch sử thực hành.</Alert>
            ) : (
              <List dense>
                {getRecentCompletions().map((completion) => (
                  <ListItem key={completion.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={completion.strategyName}
                      secondary={new Date(completion.completedAt).toLocaleString('vi-VN')}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Custom Strategy Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm chiến lược tùy chỉnh</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên chiến lược"
                value={newStrategy.name}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả"
                value={newStrategy.description}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Thời gian (phút)"
                value={newStrategy.duration}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                inputProps={{ min: 1, max: 60 }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Trigger phù hợp</InputLabel>
                <Select
                  value={newStrategy.trigger}
                  label="Trigger phù hợp"
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, trigger: e.target.value }))}
                >
                  <MenuItem value="default">Chung</MenuItem>
                  {TRIGGER_TYPES.map(trigger => (
                    <MenuItem key={trigger} value={trigger}>{trigger}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={addCustomStrategy} variant="contained">Thêm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
