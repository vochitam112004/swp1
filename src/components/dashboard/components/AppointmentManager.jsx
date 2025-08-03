import React, { useEffect } from "react";
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
} from "@mui/material";
import { useDashboardData } from "../../dashboard/hooks/useDashboardData";
import LaunchIcon from "@mui/icons-material/Launch"

const AppointmentManager = () => {
  const {
    appointments,
    loading,
    fetchAppointments,
  } = useDashboardData();

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Danh sách lịch hẹn
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : !Array.isArray(appointments) || appointments.length === 0 ? (
        <Typography>Không có lịch hẹn nào.</Typography>
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
                  <TableCell>{appointment.status}</TableCell>
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
                    {appointment.status === "Scheduled" ? (
                      <Button variant="contained" color="error" size="small">
                        Hủy
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </Box>
  );
};

export default AppointmentManager;