import React, { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Grid, FormControl, InputLabel, Select } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../../api/axios';

const AppointmentBooking = ({ coaches, onAppointmentCreated }) => {
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    consultationType: '',
    notes: ''
  });
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleCoachChange = (e) => {
    const coach = coaches.find((c) => c.id === e.target.value);
    setSelectedCoach(coach);
  };

  const getEndTime = (start, type) => {
    const [hours, minutes] = start.split(':').map(Number);
    const duration = type === 'online' ? 60 : type === 'support' ? 45 : 30;
    const end = new Date(0, 0, 0, hours, minutes + duration);
    return end.toTimeString().slice(0, 5);
  };

  const handleBookingSubmit = async () => {
    if (!selectedCoach || !appointmentData.date || !appointmentData.time || !appointmentData.consultationType) {
      toast.error('Vui lòng điền đầy đủ thông tin và chọn HLV.');
      return;
    }

    const bookingData = {
      stagerId: selectedCoach.id,
      startTime: appointmentData.time,
      endTime: getEndTime(appointmentData.time, appointmentData.consultationType),
      appointmentDate: appointmentData.date,
      status: 'Pending',
      notes: appointmentData.notes,
      createdAt: new Date().toISOString(),
      meetingLink: ''
    };

    try {
      setLoading(true);
      await api.post('/Appointment/CreateAppointment', bookingData);
      toast.success('Đặt lịch hẹn thành công!');
      onAppointmentCreated?.();
      // Reset form
      setAppointmentData({ date: '', time: '', consultationType: '', notes: '' });
      setSelectedCoach(null);
    } catch (error) {
      toast.error('Lỗi khi đặt lịch hẹn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Đặt lịch hẹn với HLV</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Chọn HLV</InputLabel>
            <Select value={selectedCoach?.id || ''} onChange={handleCoachChange} label="Chọn HLV">
              {coaches.map((coach) => (
                <MenuItem key={coach.id} value={coach.id}>
                  {coach.name || coach.username || coach.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            label="Ngày"
            type="date"
            fullWidth
            name="date"
            value={appointmentData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            label="Giờ"
            type="time"
            fullWidth
            name="time"
            value={appointmentData.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Loại tư vấn</InputLabel>
            <Select
              label="Loại tư vấn"
              name="consultationType"
              value={appointmentData.consultationType}
              onChange={handleChange}
            >
              <MenuItem value="online">Tư vấn online</MenuItem>
              <MenuItem value="support">Hỗ trợ bỏ thuốc</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Ghi chú"
            name="notes"
            fullWidth
            multiline
            minRows={2}
            value={appointmentData.notes}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleBookingSubmit} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Đặt lịch hẹn'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentBooking;
