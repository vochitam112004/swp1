import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  IconButton
} from "@mui/material";
import { useDashboardData } from "../../dashboard/hooks/useDashboardData";
import { 
  Launch as LaunchIcon,
  VideoCall as VideoIcon,
  ContentCopy as CopyIcon
} from "@mui/icons-material";
import { toast } from 'react-toastify';
import api from '../../../api/axios';
import AppointmentBookingForm from './AppointmentBookingForm';
import GoogleMeetLink from '../../common/GoogleMeetLink';

// Link Google Meet mặc định cho tất cả appointments
const DEFAULT_GOOGLE_MEET_LINK = 'https://meet.google.com/fkb-kdsd-bgu';

const AppointmentManager = () => {
  const {
    appointments,
    loading,
    fetchAppointments,
  } = useDashboardData();

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  // Debug: Log appointments data
  useEffect(() => {
    if (appointments && appointments.length > 0) {
      console.log('🔍 Debug Appointments Data:', appointments);
      appointments.forEach((apt, index) => {
        console.log(`📅 Appointment ${index + 1}:`, {
          id: apt.appointmentId,
          meetingLink: apt.meetingLink,
          hasLink: !!apt.meetingLink,
          linkLength: apt.meetingLink?.length || 0,
          fallbackLink: apt.meetingLink?.trim() || DEFAULT_GOOGLE_MEET_LINK
        });
      });
    }
  }, [appointments]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAppointmentCreated = () => {
    fetchAppointments();
    setCurrentTab(1); // Switch to appointments list tab
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Copy link to clipboard - remove this function since we use GoogleMeetLink component
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Đã copy link vào clipboard!')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        toast.success('Đã copy link vào clipboard!')
      } catch (fallbackError) {
        toast.error('Không thể copy link')
      }
      document.body.removeChild(textArea)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) {
      try {
        await api.delete(`/Appointment/Member/Cancel/${appointmentId}`);
        toast.success('Hủy lịch hẹn thành công!');
        fetchAppointments();
      } catch (error) {
        console.error('Lỗi khi hủy lịch hẹn:', error);
        toast.error('Lỗi khi hủy lịch hẹn!');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="appointment tabs">
          <Tab label="Đặt lịch hẹn mới" icon={<i className="fas fa-plus" />} />
          <Tab label="Lịch hẹn của tôi" icon={<i className="fas fa-calendar-check" />} />
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <AppointmentBookingForm onAppointmentCreated={handleAppointmentCreated} />
      )}

      {currentTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Danh sách lịch hẹn của tôi
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : !Array.isArray(appointments) || appointments.length === 0 ? (
            <Alert severity="info">
              Bạn chưa có lịch hẹn nào. Hãy đặt lịch hẹn mới với huấn luyện viên!
            </Alert>
          ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Coach</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Meeting Link</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId}>
                  <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
                  <TableCell>{appointment.startTime} - {appointment.endTime}</TableCell>
                  <TableCell>{appointment.coachName || "Coach"}</TableCell>
                  <TableCell>
                    <span style={{ 
                      color: appointment.status === 'Confirmed' ? 'green' : 
                             appointment.status === 'Pending' ? 'orange' : 
                             appointment.status === 'Cancelled' ? 'red' : 'gray',
                      fontWeight: 'bold'
                    }}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <GoogleMeetLink 
                      meetingLink={appointment.meetingLink?.trim() || DEFAULT_GOOGLE_MEET_LINK}
                      variant="button"
                      size="small"
                      showCopy={true}
                    />
                  </TableCell>
                  <TableCell>
                    {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
                      <Button 
                        variant="contained" 
                        color="error" 
                        size="small"
                        onClick={() => handleCancelAppointment(appointment.appointmentId)}
                      >
                        Hủy
                      </Button>
                    )}
                    {appointment.status === 'Cancelled' && (
                      <Button variant="outlined" size="small" disabled>
                        Đã hủy
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </Box>
    )}
    </Box>
  );
};

export default AppointmentManager;