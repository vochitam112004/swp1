import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { toast } from "react-toastify";
import achievementService from "../../api/achievementService";

export default function AchievementTemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTemplate, setEditTemplate] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    requiredMoneySaved: 0,
  });
  const [open, setOpen] = useState(false);

  // Fetch all achievement templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const result = await achievementService.getAllTemplates();
      if (result.success) {
        setTemplates(result.templates);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Không thể tải danh sách mẫu thành tích!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "requiredMoneySaved" ? parseInt(value) || 0 : value,
    });
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.warn("Vui lòng nhập tên thành tích.");
      return;
    }

    if (form.requiredMoneySaved < 0) {
      toast.warn("Số tiền tiết kiệm phải là số dương.");
      return;
    }

    try {
      let result;
      if (editTemplate) {
        result = await achievementService.updateTemplate(editTemplate.templateId, form);
        if (result.success) {
          toast.success("Đã cập nhật mẫu thành tích!");
        } else {
          throw new Error(result.error);
        }
      } else {
        result = await achievementService.createTemplate(form);
        if (result.success) {
          toast.success("Đã tạo mẫu thành tích mới!");
        } else {
          throw new Error(result.error);
        }
      }

      fetchTemplates();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Lưu mẫu thành tích thất bại!");
    }
  };

  // Handle edit
  const handleEdit = (template) => {
    setEditTemplate(template);
    setForm({
      name: template.name,
      description: template.description,
      requiredMoneySaved: template.requiredMoneySaved,
    });
    setOpen(true);
  };

  // Handle add new
  const handleAdd = () => {
    setEditTemplate(null);
    setForm({ name: "", description: "", requiredMoneySaved: 0 });
    setOpen(true);
  };

  // Handle delete
  const handleDelete = async (templateId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mẫu thành tích này?")) return;

    try {
      const result = await achievementService.deleteTemplate(templateId);
      if (result.success) {
        toast.success("Đã xóa mẫu thành tích!");
        fetchTemplates();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Xóa thất bại!");
    }
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setEditTemplate(null);
    setForm({ name: "", description: "", requiredMoneySaved: 0 });
  };

  // Sort templates by required money saved
  const sortedTemplates = [...templates].sort((a, b) => a.requiredMoneySaved - b.requiredMoneySaved);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <EmojiEventsIcon color="warning" sx={{ fontSize: '2rem' }} />
          <Typography variant="h5" fontWeight="bold">
            Quản lý mẫu thành tích
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
            }
          }}
        >
          Thêm mẫu mới
        </Button>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Mẫu thành tích định nghĩa các cột mốc quan trọng trong hành trình tiết kiệm tiền từ việc cai thuốc.
          Khi người dùng tiết kiệm đủ số tiền, họ sẽ tự động nhận được thành tích tương ứng.
        </Typography>
      </Alert>

      {/* Templates Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên thành tích</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Yêu cầu (VNĐ)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cấp độ</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTemplates.map((template, index) => {
              // Determine achievement level based on requiredMoneySaved
              let level = "Mới bắt đầu";
              let levelColor = "default";

              if (template.requiredMoneySaved >= 10000000) {
                level = "Chuyên gia";
                levelColor = "error";
              } else if (template.requiredMoneySaved >= 3000000) {
                level = "Nâng cao";
                levelColor = "warning";
              } else if (template.requiredMoneySaved >= 1000000) {
                level = "Trung cấp";
                levelColor = "info";
              } else if (template.requiredMoneySaved >= 200000) {
                level = "Cơ bản";
                levelColor = "success";
              }

              return (
                <TableRow key={template.templateId} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmojiEventsIcon
                        sx={{
                          color: levelColor === 'error' ? '#f44336' :
                            levelColor === 'warning' ? '#ff9800' :
                              levelColor === 'info' ? '#2196f3' :
                                levelColor === 'success' ? '#4caf50' : '#9e9e9e'
                        }}
                      />
                      <Typography fontWeight="medium">
                        {template.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {template.description || "Không có mô tả"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.requiredMoneySaved?.toLocaleString('vi-VN') + " VNĐ"}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={level}
                      color={levelColor}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(template)}
                      size="small"
                      title="Chỉnh sửa"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(template.templateId)}
                      size="small"
                      title="Xóa"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {templates.length === 0 && (
        <Box textAlign="center" py={4}>
          <EmojiEventsIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Chưa có mẫu thành tích nào
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Hãy tạo mẫu thành tích đầu tiên để khuyến khích người dùng!
          </Typography>
          <Button variant="contained" onClick={handleAdd}>
            Tạo mẫu đầu tiên
          </Button>
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiEventsIcon color="warning" />
            {editTemplate ? "Chỉnh sửa mẫu thành tích" : "Thêm mẫu thành tích mới"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên thành tích"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            placeholder="VD: Tiết kiệm 1 triệu đồng"
          />

          <TextField
            margin="dense"
            label="Mô tả"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            placeholder="Mô tả chi tiết về thành tích này..."
          />

          <TextField
            margin="dense"
            label="Số tiền tiết kiệm yêu cầu (VNĐ)"
            name="requiredMoneySaved"
            type="number"
            value={form.requiredMoneySaved}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0 }}
            helperText="Số tiền tối thiểu để đạt được thành tích này"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.name.trim()}
          >
            {editTemplate ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}