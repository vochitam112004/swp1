import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../../api/axios';

const AppointmentBooking = ({ onAppointmentCreated }) => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await api.get('/Coach');
        setCoaches(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách coach:', error);
        toast.error('Lỗi khi lấy danh sách coach');
      }
    };
    fetchCoaches();
  }, []);

  // Fetch available slots when coach is selected
  const fetchCoachSlots = async (coachId) => {
    setLoadingSlots(true);
    try {
      const response = await api.get(`/Appointment/Member/CoachSlots/${coachId}`);
      setAvailableSlots(response.data.filter(slot => slot.status === 'Available'));
    } catch (error) {
      console.error('Lỗi khi lấy slot của coach:', error);
      toast.error('Lỗi khi lấy lịch rảnh của coach');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleCoachChange = (e) => {
    const coach = coaches.find((c) => c.coachId === e.target.value);
    setSelectedCoach(coach);
    if (coach) {
      fetchCoachSlots(coach.coachId);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleBookSlot = async (appointmentId) => {
    if (!appointmentId) {
      toast.error('Vui lòng chọn slot để đặt lịch.');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/Appointment/Member/Book/${appointmentId}`);
      toast.success('Đặt lịch hẹn thành công!');
      onAppointmentCreated?.();
      // Refresh slots
      if (selectedCoach) {
        fetchCoachSlots(selectedCoach.coachId);
      }
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      toast.error('Lỗi khi đặt lịch hẹn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Đặt lịch hẹn với HLV</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Chọn HLV</InputLabel>
            <Select value={selectedCoach?.coachId || ''} onChange={handleCoachChange} label="Chọn HLV">
              {coaches.map((coach) => (
                <MenuItem key={coach.coachId} value={coach.coachId}>
                  {coach.displayName || coach.username || coach.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedCoach && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Lịch rảnh của {selectedCoach.displayName || selectedCoach.username}
            </Typography>
            
            {loadingSlots ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            ) : availableSlots.length === 0 ? (
              <Alert severity="info">Coach này chưa có lịch rảnh nào.</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableSlots.map((slot) => (
                      <TableRow key={slot.appointmentId}>
                        <TableCell>{formatDate(slot.appointmentDate)}</TableCell>
                        <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                        <TableCell>
                          <span style={{ 
                            color: slot.status === 'Available' ? 'green' : 'orange',
                            fontWeight: 'bold'
                          }}>
                            {slot.status === 'Available' ? 'Có thể đặt' : slot.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleBookSlot(slot.appointmentId)}
                            disabled={loading || slot.status !== 'Available'}
                          >
                            {loading ? 'Đang đặt...' : 'Đặt lịch'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AppointmentBooking;
