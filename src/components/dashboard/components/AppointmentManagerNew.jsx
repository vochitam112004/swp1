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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab
} from "@mui/material";
import { useDashboardData } from "../../dashboard/hooks/useDashboardData";
import LaunchIcon from "@mui/icons-material/Launch";
import { toast } from 'react-toastify';
import api from '../../../api/axios';
import AppointmentBookingForm from './AppointmentBookingForm';

const AppointmentManager = () => {
  const {
    appointments,
    loading,
    fetchAppointments,
  } = useDashboardData();

  const [currentTab, setCurrentTab] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editAppointment, setEditAppointment] = useState({
    appointmentId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    status: '',
    notes: '',
    meetingLink: ''
  });

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

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

  const handleOpenEditDialog = (appointment) => {
    setEditAppointment({
      appointmentId: appointment.appointmentId,
      appointmentDate: appointment.appointmentDate.split('T')[0], // Format for date input
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status || '',
      notes: appointment.notes || '',
      meetingLink: appointment.meetingLink || ''
    });
    setOpenEditDialog(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editAppointment.appointmentDate || !editAppointment.startTime || !editAppointment.endTime) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (editAppointment.startTime >= editAppointment.endTime) {
      toast.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
      return;
    }

    try {
      await api.put(`/Appointment/${editAppointment.appointmentId}`, {
        appointmentDate: editAppointment.appointmentDate,
        startTime: editAppointment.startTime,
        endTime: editAppointment.endTime,
        status: editAppointment.status,
        notes: editAppointment.notes,
        meetingLink: editAppointment.meetingLink
      });
      toast.success('Cập nhật lịch hẹn thành công!');
      setOpenEditDialog(false);
      fetchAppointments();
    } catch (error) {
      console.error('Lỗi khi cập nhật lịch hẹn:', error);
      toast.error('Lỗi khi cập nhật lịch hẹn!');
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
                    <TableCell>Ghi chú</TableCell>
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
                      <TableCell>{appointment.notes || "-"}</TableCell>
                      <TableCell>
                        {appointment.meetingLink ? (
                          <Button
                            size="small"
                            color="primary"
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={<LaunchIcon />}
                          >
                            Tham gia
                          </Button>
                        ) : (
                          <Button variant="outlined" size="small" disabled>
                            Chưa có
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small" 
                          onClick={() => handleOpenEditDialog(appointment)}
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small" 
                          onClick={() => handleCancelAppointment(appointment.appointmentId)}
                        >
                          Hủy
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Edit Dialog */}
          <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Chỉnh sửa lịch hẹn</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Ngày"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editAppointment.appointmentDate}
                onChange={e => setEditAppointment({ ...editAppointment, appointmentDate: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Thời gian bắt đầu"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editAppointment.startTime}
                onChange={e => setEditAppointment({ ...editAppointment, startTime: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Thời gian kết thúc"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editAppointment.endTime}
                onChange={e => setEditAppointment({ ...editAppointment, endTime: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Trạng thái"
                fullWidth
                value={editAppointment.status}
                onChange={e => setEditAppointment({ ...editAppointment, status: e.target.value })}
                disabled
                helperText="Trạng thái được quản lý bởi hệ thống"
              />
              <TextField
                margin="dense"
                label="Ghi chú"
                fullWidth
                multiline
                minRows={2}
                value={editAppointment.notes}
                onChange={e => setEditAppointment({ ...editAppointment, notes: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Link Online"
                fullWidth
                value={editAppointment.meetingLink}
                onChange={e => setEditAppointment({ ...editAppointment, meetingLink: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
              <Button onClick={handleUpdateAppointment} variant="contained" color="primary">
                Cập nhật
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentManager;
