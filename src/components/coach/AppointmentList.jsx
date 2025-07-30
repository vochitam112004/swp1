import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton
} from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import { Link } from '@mui/material'
import api from '../../api/axios'
import ChatSupport from "../chat/ChatSupport"

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([])
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [selectedDisplayName, setSelectedDisplayName] = useState("")

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/Appointment/GetAppointments')
                setAppointments(res.data)
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lịch hẹn:", error)
            }
        }

        fetchAppointments()
    }, [])

    const handleChat = (userId, displayName) => {
        setSelectedUserId(userId)
        setSelectedDisplayName(displayName)
    }

    const handleCloseChat = () => {
        setSelectedUserId(null)
        setSelectedDisplayName("")
    }

    const uniqueMemberUserIds = new Set();
    const filteredAppointments = appointments.filter((item) => {
        if (!uniqueMemberUserIds.has(item.memberUserId)) {
            uniqueMemberUserIds.add(item.memberUserId)
            return true;
        }
        return false;
    });

    return (
        <div>
            <Box p={3}>
                {appointments.length === 0 ? (
                    <Typography>Không có lịch hẹn nào.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableCell>Thành viên</TableCell>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    <TableCell>Link Online</TableCell>
                                    <TableCell>Nhắn tin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((item) => (
                                    <TableRow key={item.appointmentId}>
                                        <TableCell>{item.memberName}</TableCell>
                                        <TableCell>{item.appointmentDate}</TableCell>
                                        <TableCell>{item.startTime} - {item.endTime}</TableCell>
                                        <TableCell>{item.notes || 'Không có'}</TableCell>
                                        <TableCell>
                                            {item.meetingLink ? (
                                                <Link href={item.meetingLink} target="_blank" rel="noopener noreferrer" underline="hover">
                                                    Tham gia
                                                </Link>
                                            ) : (
                                                'Chưa có'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {filteredAppointments.some(appt => appt.memberUserId === item.memberUserId) && (
                                                <IconButton onClick={() => handleChat(item.memberUserId, item.memberName)}>
                                                    <ChatIcon sx={{ color: '#1976d2' }} />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {selectedUserId && (
                <ChatSupport
                    targetUserId={selectedUserId}
                    targetDisplayName={selectedDisplayName}
                    onClose={handleCloseChat}
                />
            )}
        </div>
    )
}
