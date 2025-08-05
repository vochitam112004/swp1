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
        endTime: '',
        meetingLink: ''
    })
    const [openEditSlot, setOpenEditSlot] = useState(false);
    const [editSlot, setEditSlot] = useState({
        appointmentId: '',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        status: '',
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
    const deleteCoachSlot = async (appointmentId, slot) => {
        // Kiểm tra slot đã được book chưa
        const isBooked = slot?.status !== 'Available';
        const hasBooking = slot?.memberName && slot?.memberName !== '';
        
        if (isBooked || hasBooking) {
            toast.warning('Không thể xóa slot đã được thành viên đặt lịch!');
            return;
        }

        if (window.confirm('Bạn có chắc muốn xóa slot này?')) {
            try {
                await api.delete(`/Appointment/Coach/DeleteSlot/${appointmentId}`)
                toast.success('Xóa slot thành công!')
                fetchMyCoachSlots()
            } catch (error) {
                console.error("Lỗi khi xóa slot:", error)
                
                let errorMessage = 'Lỗi khi xóa slot!'
                if (error.response?.status === 400) {
                    if (typeof error.response?.data === 'string') {
                        errorMessage = error.response.data
                        if (errorMessage.includes('booked')) {
                            errorMessage = 'Không thể xóa slot đã được đặt lịch. Vui lòng hủy lịch hẹn trước.'
                        }
                    }
                }
                toast.error(errorMessage)
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

        // Kiểm tra overlap với các slot đã có
        const hasOverlap = slots.some(existingSlot => {
            if (existingSlot.appointmentDate === newSlot.appointmentDate) {
                const newStart = newSlot.startTime
                const newEnd = newSlot.endTime
                const existingStart = existingSlot.startTime.substring(0, 5) // Lấy HH:MM từ HH:MM:SS
                const existingEnd = existingSlot.endTime.substring(0, 5)
                
                // Kiểm tra overlap: 
                // New slot starts before existing ends AND new slot ends after existing starts
                return (newStart < existingEnd && newEnd > existingStart)
            }
            return false
        })

        if (hasOverlap) {
            toast.error(`Slot bị trùng với slot đã có trong ngày ${newSlot.appointmentDate}! Vui lòng chọn thời gian khác.`)
            return
        }

        // Payload đúng theo API documentation + seconds format
        const payload = {
            availabilities: [{
                appointmentDate: newSlot.appointmentDate,
                startTime: `${newSlot.startTime}:00`,  // HH:MM:SS format required
                endTime: `${newSlot.endTime}:00`,      // HH:MM:SS format required
                meetingLink: newSlot.meetingLink || null  // Thêm Google Meet link nếu có
            }]
        }

        console.log('🚀 Creating slot with WORKING format')
        console.log('Payload:', payload)

        try {
            const response = await api.post('/Appointment/Coach/CreateWeekSlots', payload)
            console.log('✅ SUCCESS!', response.data)
            
            // Nếu có meetingLink và tạo slot thành công, cập nhật thêm meetingLink
            if (newSlot.meetingLink && response.data) {
                try {
                    // Lấy appointmentId của slot vừa tạo
                    await fetchMyCoachSlots(); // Refresh để lấy slot mới
                    
                    // Tìm slot vừa tạo (cùng ngày và thời gian)
                    const currentSlots = await api.get('/Appointment/Coach/MySlots');
                    const newCreatedSlot = currentSlots.data.find(slot => 
                        slot.appointmentDate === newSlot.appointmentDate &&
                        slot.startTime.substring(0,5) === newSlot.startTime &&
                        slot.endTime.substring(0,5) === newSlot.endTime
                    );
                    
                    if (newCreatedSlot) {
                        await api.put(`/Appointment/Coach/UpdateSlot/${newCreatedSlot.appointmentId}`, {
                            appointmentDate: newCreatedSlot.appointmentDate,
                            startTime: newCreatedSlot.startTime,
                            endTime: newCreatedSlot.endTime,
                            status: newCreatedSlot.status,
                            meetingLink: newSlot.meetingLink
                        });
                        console.log('✅ Meeting link added successfully!');
                    }
                } catch (linkError) {
                    console.warn('⚠️ Slot created but failed to add meeting link:', linkError);
                    toast.warning('Slot tạo thành công nhưng không thể thêm link Google Meet. Bạn có thể thêm sau bằng cách chỉnh sửa slot.');
                }
            }
            
            toast.success('Tạo slot rảnh thành công!')
            setOpenAddSlot(false)
            setNewSlot({ appointmentDate: '', startTime: '', endTime: '', meetingLink: '' })
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
                // Kiểm tra nếu response.data là string trực tiếp (như overlap error)
                if (typeof error.response?.data === 'string') {
                    errorMessage = error.response.data
                } else {
                    // Kiểm tra validation errors object
                    const errors = error.response?.data?.errors
                    if (errors) {
                        const errorKeys = Object.keys(errors)
                        errorMessage = `Validation lỗi: ${errorKeys.join(', ')}`
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message
                    } else if (error.response?.data?.title) {
                        errorMessage = error.response.data.title
                    }
                }
            }
            
            toast.error(errorMessage)
        }
    }

    const handleOpenEditSlot = (slot) => {
        // Kiểm tra slot đã được book chưa
        const isBooked = slot.status !== 'Available';
        const hasBooking = slot.memberName && slot.memberName !== '';
        
        if (isBooked || hasBooking) {
            toast.warning('Không thể chỉnh sửa slot đã được thành viên đặt lịch!');
            return;
        }

        // Format thời gian để hiển thị trong input (HH:MM)
        const formatTimeForInput = (timeStr) => {
            if (timeStr && timeStr.length >= 5) {
                return timeStr.substring(0, 5); // Lấy HH:MM từ HH:MM:SS
            }
            return timeStr;
        };

        setEditSlot({
            appointmentId: slot.appointmentId,
            appointmentDate: slot.appointmentDate,
            startTime: formatTimeForInput(slot.startTime),
            endTime: formatTimeForInput(slot.endTime),
            status: slot.status || '',
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

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(editSlot.appointmentDate)) {
            toast.error('Ngày phải có định dạng YYYY-MM-DD!')
            return
        }

        // Validate time format
        const timeRegex = /^\d{2}:\d{2}$/
        if (!timeRegex.test(editSlot.startTime) || !timeRegex.test(editSlot.endTime)) {
            toast.error('Thời gian phải có định dạng HH:MM!')
            return
        }

        try {
            // Đảm bảo format thời gian có giây (HH:MM:SS)
            const formatTime = (timeStr) => {
                if (timeStr && timeStr.length === 5) {
                    return timeStr + ':00'; // Thêm :00 cho giây
                }
                return timeStr;
            };

            await api.put(`/Appointment/Coach/UpdateSlot/${editSlot.appointmentId}`, {
                appointmentDate: editSlot.appointmentDate,
                startTime: formatTime(editSlot.startTime),
                endTime: formatTime(editSlot.endTime),
                status: editSlot.status,
                meetingLink: editSlot.meetingLink
            });
            toast.success('Cập nhật slot thành công!')
            setOpenEditSlot(false);
            fetchMyCoachSlots();
        } catch (error) {
            console.error("Lỗi khi cập nhật slot:", error);
            console.error("Error details:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            let errorMessage = 'Lỗi khi cập nhật slot!'
            if (error.response?.status === 400) {
                if (typeof error.response?.data === 'string') {
                    errorMessage = error.response.data
                    if (errorMessage.includes('booked')) {
                        errorMessage = 'Không thể cập nhật slot đã được đặt lịch. Slot này đã có member đặt rồi.'
                    }
                } else if (error.response?.data?.errors) {
                    const errors = error.response.data.errors
                    const errorKeys = Object.keys(errors)
                    errorMessage = `Validation lỗi: ${errorKeys.join(', ')}`
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message
                }
            }
            toast.error(errorMessage)
        }
    };

    return (
        <div>
            <Box p={3}>
                <Typography variant="h6" gutterBottom>Danh sách lịch hẹn của tôi</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    💡 Lưu ý: Chỉ có thể chỉnh sửa/xóa các slot chưa được thành viên đặt lịch
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>●</span> Available - Có thể đặt
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ color: 'blue', fontWeight: 'bold' }}>●</span> Booked - Đã được đặt
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ color: 'orange', fontWeight: 'bold' }}>●</span> Other - Trạng thái khác
                    </Typography>
                </Box>
                <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenAddSlot(true)}>
                    Thêm slot rảnh
                </Button>
                {slots.length === 0 ? (
                    <Typography>Chưa có slot rảnh nào.</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
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
                                {slots.map(slot => {
                                    const isBooked = slot.status !== 'Available';
                                    const hasBooking = slot.memberName && slot.memberName !== '';
                                    
                                    return (
                                        <TableRow key={slot.appointmentId}>
                                            <TableCell>{slot.appointmentDate}</TableCell>
                                            <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                                            <TableCell>
                                                <span style={{
                                                    color: slot.status === 'Available' ? 'green' : 
                                                           slot.status === 'Booked' ? 'blue' : 'orange',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {slot.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{slot.memberName || <span className="text-muted">Chưa có</span>}</TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => deleteCoachSlot(slot.appointmentId, slot)}
                                                    disabled={isBooked || hasBooking}
                                                    title={isBooked || hasBooking ? "Không thể xóa slot đã được đặt" : "Xóa slot"}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </IconButton>
                                                <IconButton 
                                                    color="primary" 
                                                    onClick={() => handleOpenEditSlot(slot)}
                                                    disabled={isBooked || hasBooking}
                                                    title={isBooked || hasBooking ? "Không thể sửa slot đã được đặt" : "Chỉnh sửa slot"}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

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

                {/* Dialog thêm slot */}
                <Dialog open={openAddSlot} onClose={() => setOpenAddSlot(false)}>
                    <DialogTitle>Thêm slot rảnh mới</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Ngày"
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
                        <TextField
                            margin="dense"
                            label="Link Google Meet"
                            fullWidth
                            variant="outlined"
                            value={newSlot.meetingLink}
                            onChange={(e) => setNewSlot({ ...newSlot, meetingLink: e.target.value })}
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            helperText="Bạn có thể thêm link Google Meet ngay khi tạo slot"
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
