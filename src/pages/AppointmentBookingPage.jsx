import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import AppointmentBookingForm from '../dashboard/components/AppointmentBookingForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AppointmentBookingPage = () => {
  const navigate = useNavigate();

  const handleAppointmentCreated = () => {
    toast.success('Lịch hẹn đã được đặt thành công!');
    // Navigate to dashboard appointment tab after successful booking
    navigate('/dashboard?tab=appointment');
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
              Đặt lịch hẹn với Huấn luyện viên
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Chọn huấn luyện viên phù hợp và đặt lịch hẹn tư vấn cá nhân
            </Typography>
          </Box>
          
          <AppointmentBookingForm onAppointmentCreated={handleAppointmentCreated} />
        </Paper>
      </Container>
    </Box>
  );
};

export default AppointmentBookingPage;
