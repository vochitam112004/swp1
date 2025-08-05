import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  VideoCall as VideoIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../../api/axios';
import { useAuth } from '../../auth/AuthContext';

const AppointmentBookingForm = ({ onAppointmentCreated }) => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingNote, setBookingNote] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Fetch coaches when component mounts
  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      // Thử lấy từ endpoint coach trước
      let response;
      try {
        response = await api.get('/Coach');
      } catch (error) {
        // Fallback sang endpoint chat contacts
        response = await api.get('/ChatMessage/available-contacts');
      }
      
      const coachData = response.data || [];
      // Format data để đảm bảo consistency
      const formattedCoaches = coachData.map(coach => ({
        coachId: coach.coachId || coach.userId,
        displayName: coach.displayName || coach.name || coach.username,
        username: coach.username,
        email: coach.email,
        specialization: coach.specialization || 'Tư vấn cai thuốc lá',
        avatarUrl: coach.avatarUrl || coach.avatar,
        phoneNumber: coach.phoneNumber,
        isActive: coach.isActive !== false // Default to true if not specified
      })).filter(coach => coach.isActive); // Only show active coaches

      setCoaches(formattedCoaches);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách coach:', error);
      toast.error('Không thể tải danh sách huấn luyện viên');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachSlots = async (coachId) => {
    if (!coachId) return;
    
    setLoadingSlots(true);
    try {
      const response = await api.get(`/Appointment/Member/CoachSlots/${coachId}`);
      // Filter to only show available slots and future dates
      const now = new Date();
      const availableSlots = (response.data || [])
        .filter(slot => {
          const slotDate = new Date(slot.appointmentDate);
          return slot.status === 'Available' && slotDate >= now;
        })
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

      setAvailableSlots(availableSlots);
    } catch (error) {
      console.error('Lỗi khi lấy slot của coach:', error);
      toast.error('Lỗi khi lấy lịch rảnh của huấn luyện viên');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleCoachSelect = (coach) => {
    setSelectedCoach(coach);
    setAvailableSlots([]);
    setSelectedSlot(null);
    if (coach) {
      fetchCoachSlots(coach.coachId);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setConfirmDialog(true);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      toast.error('Vui lòng chọn slot để đặt lịch.');
      return;
    }

    try {
      setLoading(true);
      
      // Book the appointment
      await api.post(`/Appointment/Member/Book/${selectedSlot.appointmentId}`, {
        notes: bookingNote || `Đặt lịch hẹn với ${selectedCoach?.displayName}`
      });

      toast.success('Đặt lịch hẹn thành công!');
      setConfirmDialog(false);
      setSelectedSlot(null);
      setBookingNote('');
      
      // Refresh data
      if (selectedCoach) {
        fetchCoachSlots(selectedCoach.coachId);
      }
      
      // Call callback if provided
      onAppointmentCreated?.();
      
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      
      // Handle specific error messages
      let errorMessage = 'Lỗi khi đặt lịch hẹn. Vui lòng thử lại.';
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Slot này đã được đặt hoặc không còn khả dụng.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Bạn đã có lịch hẹn trùng thời gian này.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString?.substring(0, 5) || timeString; // HH:MM format
  };

  if (loading && coaches.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Đang tải danh sách huấn luyện viên...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Đặt lịch hẹn với Huấn luyện viên
      </Typography>

      {/* Coach Selection */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Chọn Huấn luyện viên
        </Typography>
        
        {coaches.length === 0 ? (
          <Alert severity="info">Hiện tại không có huấn luyện viên nào khả dụng.</Alert>
        ) : (
          <Grid container spacing={2}>
            {coaches.map((coach) => (
              <Grid item xs={12} sm={6} md={4} key={coach.coachId}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedCoach?.coachId === coach.coachId ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handleCoachSelect(coach)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        src={coach.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(coach.displayName)}&background=1976d2&color=fff`}
                        alt={coach.displayName}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {coach.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {coach.specialization}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Chip 
                      label="Đang hoạt động" 
                      color="success" 
                      size="small" 
                      icon={<CheckIcon />}
                      sx={{ mb: 1 }}
                    />
                    
                    {coach.email && (
                      <Typography variant="body2" color="text.secondary">
                        📧 {coach.email}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Available Slots */}
      {selectedCoach && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Lịch trống của {selectedCoach.displayName}
          </Typography>

          {loadingSlots ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Đang tải lịch trống...
              </Typography>
            </Box>
          ) : availableSlots.length === 0 ? (
            <Alert severity="info">
              Huấn luyện viên này hiện tại chưa có lịch trống nào.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Ngày</strong></TableCell>
                    <TableCell><strong>Thời gian</strong></TableCell>
                    <TableCell><strong>Trạng thái</strong></TableCell>
                    <TableCell><strong>Hành động</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableSlots.map((slot) => (
                    <TableRow key={slot.appointmentId} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(slot.appointmentDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Có thể đặt"
                          color="success"
                          size="small"
                          icon={<CheckIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSlotSelect(slot)}
                          disabled={loading}
                          startIcon={<CalendarIcon />}
                        >
                          Đặt lịch
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Xác nhận đặt lịch hẹn
        </DialogTitle>
        <DialogContent>
          {selectedSlot && selectedCoach && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Bạn đang đặt lịch hẹn với <strong>{selectedCoach.displayName}</strong>
              </Alert>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày hẹn:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {formatDate(selectedSlot.appointmentDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú (tùy chọn)"
                placeholder="Nhập nội dung bạn muốn trao đổi hoặc ghi chú đặc biệt..."
                value={bookingNote}
                onChange={(e) => setBookingNote(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Alert severity="success" icon={<VideoIcon />}>
                Link cuộc họp sẽ được gửi cho bạn sau khi huấn luyện viên xác nhận.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={handleBookAppointment} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <CheckIcon />}
          >
            {loading ? 'Đang đặt...' : 'Xác nhận đặt lịch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentBookingForm;
