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
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material'
import { Link } from '@mui/material'
import api from '../../api/axios'

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([])
    const [slots, setSlots] = useState([])
    const [openAddSlot, setOpenAddSlot] = useState(false)
    const [newSlot, setNewSlot] = useState({
        appointmentDate: '',
        startTime: '',
        endTime: ''
    })
    const [openEditSlot, setOpenEditSlot] = useState(false);
    const [editSlot, setEditSlot] = useState({
        appointmentId: '',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        status: '',
        notes: '',
        meetingLink: ''
    });

    // Lấy lịch hẹn từ member
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/Appointment/MyAppointments')
                setAppointments(res.data)
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lịch hẹn:", error)
            }
        }
        fetchAppointments()
    }, [])

    // Lấy slot rảnh của coach
    const fetchMyCoachSlots = async () => {
        try {
            const res = await api.get('/Appointment/Coach/MySlots')
            setSlots(res.data)
        } catch (error) {
            console.error("Lỗi khi lấy slot rảnh:", error)
        }
    }

    useEffect(() => {
        fetchMyCoachSlots()
    }, [])

    // Xóa slot rảnh
    const deleteCoachSlot = async (appointmentId) => {
        if (window.confirm('Bạn có chắc muốn xóa slot này?')) {
            try {
                await api.delete(`/Appointment/Coach/DeleteSlot/${appointmentId}`)
                fetchMyCoachSlots()
            } catch (error) {
                console.error("Lỗi khi xóa slot:", error)
            }
        }
    }

    // Tạo slot rảnh mới
    const handleAddSlot = async () => {
        if (!newSlot.appointmentDate || !newSlot.startTime || !newSlot.endTime) return
        try {
            await api.post('/Appointment/Coach/CreateWeekSlots', {
                availabilities: [newSlot]
            })
            setOpenAddSlot(false)
            setNewSlot({ appointmentDate: '', startTime: '', endTime: '' })
            fetchMyCoachSlots()
        } catch (error) {
            console.error("Lỗi khi tạo slot rảnh:", error)
        }
    }

    const handleOpenEditSlot = (slot) => {
        setEditSlot({
            appointmentId: slot.appointmentId,
            appointmentDate: slot.appointmentDate,
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: slot.status || '',
            notes: slot.notes || '',
            meetingLink: slot.meetingLink || ''
        });
        setOpenEditSlot(true);
    };

    const handleUpdateSlot = async () => {
        try {
            await api.put(`/Appointment/Coach/UpdateSlot/${editSlot.appointmentId}`, {
                appointmentDate: editSlot.appointmentDate,
                startTime: editSlot.startTime,
                endTime: editSlot.endTime,
                status: editSlot.status,
                notes: editSlot.notes,
                meetingLink: editSlot.meetingLink
            });
            setOpenEditSlot(false);
            fetchMyCoachSlots();
        } catch (error) {
            console.error("Lỗi khi cập nhật slot:", error);
        }
    };

    return (
        <div>
            <Box p={3}>
                <Typography variant="h6" gutterBottom>Lịch hẹn từ thành viên</Typography>
                {appointments.length === 0 ? (
                    <Typography>Không có lịch hẹn nào.</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableCell>Thành viên</TableCell>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    <TableCell>Link Online</TableCell>
                                    <TableCell>Trạng thái</TableCell>
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
                                            <span className={`badge bg-${item.status === 'Confirmed' ? 'success' : item.status === 'Pending' ? 'warning' : 'secondary'}`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Typography variant="h6" gutterBottom>Slot rảnh của bạn</Typography>
                <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenAddSlot(true)}>
                    Thêm slot rảnh
                </Button>
                {slots.length === 0 ? (
                    <Typography>Chưa có slot rảnh nào.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Thành viên đặt</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {slots.map(slot => (
                                    <TableRow key={slot.appointmentId}>
                                        <TableCell>{slot.appointmentDate}</TableCell>
                                        <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                                        <TableCell>{slot.status}</TableCell>
                                        <TableCell>{slot.memberName || <span className="text-muted">Chưa có</span>}</TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={() => deleteCoachSlot(slot.appointmentId)}>
                                                <i className="fas fa-trash"></i>
                                            </IconButton>
                                            <IconButton color="primary" onClick={() => handleOpenEditSlot(slot)}>
                                                <i className="fas fa-edit"></i>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={openEditSlot} onClose={() => setOpenEditSlot(false)}>
                    <DialogTitle>Cập nhật slot rảnh</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Ngày (YYYY-MM-DD)"
                            type="date"
                            fullWidth
                            value={editSlot.appointmentDate}
                            onChange={e => setEditSlot({ ...editSlot, appointmentDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="dense"
                            label="Giờ bắt đầu"
                            type="time"
                            fullWidth
                            value={editSlot.startTime}
                            onChange={e => setEditSlot({ ...editSlot, startTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="dense"
                            label="Giờ kết thúc"
                            type="time"
                            fullWidth
                            value={editSlot.endTime}
                            onChange={e => setEditSlot({ ...editSlot, endTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="dense"
                            label="Trạng thái"
                            fullWidth
                            value={editSlot.status}
                            onChange={e => setEditSlot({ ...editSlot, status: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Ghi chú"
                            fullWidth
                            value={editSlot.notes}
                            onChange={e => setEditSlot({ ...editSlot, notes: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Link Online"
                            fullWidth
                            value={editSlot.meetingLink}
                            onChange={e => setEditSlot({ ...editSlot, meetingLink: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditSlot(false)}>Hủy</Button>
                        <Button onClick={handleUpdateSlot} variant="contained" color="primary">Cập nhật</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog thêm slot rảnh */}
                <Dialog open={openAddSlot} onClose={() => setOpenAddSlot(false)}>
                    <DialogTitle>Thêm slot rảnh mới</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Ngày (YYYY-MM-DD)"
                            type="date"
                            fullWidth
                            value={newSlot.appointmentDate}
                            onChange={e => setNewSlot({ ...newSlot, appointmentDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="dense"
                            label="Giờ bắt đầu"
                            type="time"
                            fullWidth
                            value={newSlot.startTime}
                            onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="dense"
                            label="Giờ kết thúc"
                            type="time"
                            fullWidth
                            value={newSlot.endTime}
                            onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddSlot(false)}>Hủy</Button>
                        <Button onClick={handleAddSlot} variant="contained" color="primary">Thêm</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    )
}