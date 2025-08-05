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
    TextField,
    Alert
} from '@mui/material'
import { Link } from '@mui/material'
import { toast } from 'react-toastify'
import { useAuth } from '../auth/AuthContext'
import api from '../../api/axios'

export default function AppointmentList() {
    const { user } = useAuth()
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
            console.log('My slots response:', res.data)
            setSlots(res.data)
        } catch (error) {
            console.error("Lỗi khi lấy slot rảnh:", error)
            console.error("Error response:", error.response?.data)
            console.error("Error status:", error.response?.status)
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
                toast.success('Xóa slot thành công!')
                fetchMyCoachSlots()
            } catch (error) {
                console.error("Lỗi khi xóa slot:", error)
                toast.error('Lỗi khi xóa slot!')
            }
        }
    }

    // Tạo slot rảnh mới - VERSION ĐÃ FIXED
    const handleAddSlot = async () => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            toast.error('Bạn cần đăng nhập để thực hiện chức năng này!')
            return
        }

        if (!newSlot.appointmentDate || !newSlot.startTime || !newSlot.endTime) {
            toast.error('Vui lòng điền đầy đủ thông tin!')
            return
        }
        
        if (newSlot.startTime >= newSlot.endTime) {
            toast.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!')
            return
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(newSlot.appointmentDate)) {
            toast.error('Ngày phải có định dạng YYYY-MM-DD!')
            return
        }

        const timeRegex = /^\d{2}:\d{2}$/
        if (!timeRegex.test(newSlot.startTime) || !timeRegex.test(newSlot.endTime)) {
            toast.error('Thời gian phải có định dạng HH:MM!')
            return
        }

        // Payload đúng theo API documentation + seconds format
        const payload = {
            availabilities: [{
                appointmentDate: newSlot.appointmentDate,
                startTime: `${newSlot.startTime}:00`,  // HH:MM:SS format required
                endTime: `${newSlot.endTime}:00`       // HH:MM:SS format required
            }]
        }

        console.log('🚀 Creating slot with WORKING format')
        console.log('Payload:', payload)

        try {
            const response = await api.post('/Appointment/Coach/CreateWeekSlots', payload)
            console.log('✅ SUCCESS!', response.data)
            toast.success('Tạo slot rảnh thành công!')
            setOpenAddSlot(false)
            setNewSlot({ appointmentDate: '', startTime: '', endTime: '' })
            fetchMyCoachSlots()
        } catch (error) {
            console.error("❌ Error:", error)
            console.error("Status:", error.response?.status)
            console.error("Data:", error.response?.data)
            
            let errorMessage = 'Lỗi khi tạo slot rảnh!'
            if (error.response?.status === 401) {
                errorMessage = 'Bạn không có quyền! Kiểm tra đăng nhập.'
            } else if (error.response?.status === 403) {
                errorMessage = 'Truy cập bị từ chối! Bạn có phải Coach không?'
            } else if (error.response?.status === 400) {
                const errors = error.response?.data?.errors
                if (errors) {
                    const errorKeys = Object.keys(errors)
                    errorMessage = `Validation lỗi: ${errorKeys.join(', ')}`
                }
            }
            toast.error(errorMessage)
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
        if (!editSlot.appointmentDate || !editSlot.startTime || !editSlot.endTime) {
            toast.error('Vui lòng điền đầy đủ thông tin!')
            return
        }

        if (editSlot.startTime >= editSlot.endTime) {
            toast.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!')
            return
        }

        try {
            await api.put(`/Appointment/Coach/UpdateSlot/${editSlot.appointmentId}`, {
                appointmentDate: editSlot.appointmentDate,
                startTime: editSlot.startTime,
                endTime: editSlot.endTime,
                status: editSlot.status,
                notes: editSlot.notes,
                meetingLink: editSlot.meetingLink
            });
            toast.success('Cập nhật slot thành công!')
            setOpenEditSlot(false);
            fetchMyCoachSlots();
        } catch (error) {
            console.error("Lỗi khi cập nhật slot:", error);
            toast.error('Lỗi khi cập nhật slot!')
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

                {/* Dialog thêm slot */}
                <Dialog open={openAddSlot} onClose={() => setOpenAddSlot(false)}>
                    <DialogTitle>Thêm slot rảnh mới</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Ngày (YYYY-MM-DD)"
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={newSlot.appointmentDate}
                            onChange={(e) => setNewSlot({ ...newSlot, appointmentDate: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Thời gian bắt đầu"
                            type="time"
                            fullWidth
                            variant="outlined"
                            value={newSlot.startTime}
                            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Thời gian kết thúc"
                            type="time"
                            fullWidth
                            variant="outlined"
                            value={newSlot.endTime}
                            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddSlot(false)}>Hủy</Button>
                        <Button onClick={handleAddSlot} variant="contained" color="primary">Thêm</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog chỉnh sửa slot */}
                <Dialog open={openEditSlot} onClose={() => setOpenEditSlot(false)}>
                    <DialogTitle>Cập nhật slot rảnh</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Ngày"
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={editSlot.appointmentDate}
                            onChange={(e) => setEditSlot({ ...editSlot, appointmentDate: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Thời gian bắt đầu"
                            type="time"
                            fullWidth
                            variant="outlined"
                            value={editSlot.startTime}
                            onChange={(e) => setEditSlot({ ...editSlot, startTime: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Thời gian kết thúc"
                            type="time"
                            fullWidth
                            variant="outlined"
                            value={editSlot.endTime}
                            onChange={(e) => setEditSlot({ ...editSlot, endTime: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Trạng thái"
                            fullWidth
                            variant="outlined"
                            value={editSlot.status}
                            onChange={(e) => setEditSlot({ ...editSlot, status: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Ghi chú"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={2}
                            value={editSlot.notes}
                            onChange={(e) => setEditSlot({ ...editSlot, notes: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Link Online"
                            fullWidth
                            variant="outlined"
                            value={editSlot.meetingLink}
                            onChange={(e) => setEditSlot({ ...editSlot, meetingLink: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditSlot(false)}>Hủy</Button>
                        <Button onClick={handleUpdateSlot} variant="contained" color="primary">Cập nhật</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    )
}
