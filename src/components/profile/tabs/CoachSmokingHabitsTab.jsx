import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Autocomplete,
  Stack,
  Card,
  TextField
} from "@mui/material";
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Assignment as AssignIcon,
  PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import ApiHelper from "../../../utils/apiHelper";
import { useAuth } from "../../auth/AuthContext";
import { getAvailableActions } from "../../../utils/triggerFactorPermissions";

export default function CoachSmokingHabitsTab() {
  const { user } = useAuth();
  const actions = getAvailableActions(user);

  // TriggerFactor states
  const [allTriggerFactors, setAllTriggerFactors] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberTriggers, setMemberTriggers] = useState([]);
  const [memberTriggersCache, setMemberTriggersCache] = useState({});
  const [assignedTriggers, setAssignedTriggers] = useState({}); // Track what we've assigned
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Form states
  const [newTriggerName, setNewTriggerName] = useState('');
  const [selectedTriggersToAssign, setSelectedTriggersToAssign] = useState([]);
  const [editingTrigger, setEditingTrigger] = useState(null);
  const [editTriggerName, setEditTriggerName] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Update form data when memberProfile changes
  useEffect(() => {
    if (actions.isCoach) {
      loadInitialData();
    }
  }, [actions.isCoach]);

  // Load member triggers when member is selected
  useEffect(() => {
    if (selectedMember) {
      console.log('🔄 Selected member changed, loading triggers for:', selectedMember.displayName);
      loadMemberTriggers();
    } else {
      setMemberTriggers([]);
    }
  }, [selectedMember]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading initial data for coach...');
      await Promise.all([
        loadAllTriggerFactors(),
        loadMembers()
      ]);
      console.log('✅ Initial data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      toast.error('Có lỗi khi tải dữ liệu ban đầu');
    } finally {
      setLoading(false);
    }
  };

  const loadAllTriggerFactors = async () => {
    try {
      const triggers = await ApiHelper.fetchAllTriggerFactors();
      setAllTriggerFactors(triggers);
    } catch (error) {
      console.error('Error loading all trigger factors:', error);
      toast.error(error.message);
    }
  };

  const loadMembers = async () => {
    try {
      console.log('🔄 Loading members list...');
      const response = await api.get('/User/Get-All-User');
      const memberUsers = response.data
        .filter(user => user.userType === 'Member')
        .filter((user, index, self) => 
          // Remove duplicates based on userId and email combination
          index === self.findIndex(u => u.userId === user.userId && u.email === user.email)
        )
        .map((user, index) => ({
          ...user,
          uniqueKey: `${user.userId}-${user.email}-${index}` // Add unique key for React
        }));
      console.log(`✅ Loaded ${memberUsers.length} unique members`);
      setMembers(memberUsers);
    } catch (error) {
      console.error('❌ Error loading members:', error);
      toast.error('Không thể tải danh sách thành viên');
    }
  };

  const loadMemberTriggers = async () => {
    if (!selectedMember) return;
    
    try {
      console.log(`🔄 Loading trigger factors for member: ${selectedMember.displayName} (ID: ${selectedMember.userId})`);
      
      // Try to get member's trigger factors using their ID
      const triggers = await ApiHelper.getMemberTriggerFactors(selectedMember.userId);
      
      console.log(`✅ Loaded ${triggers.length} trigger factors for member:`, triggers);
      setMemberTriggers(triggers);
      
      // Cache the triggers for this member
      setMemberTriggersCache(prev => ({
        ...prev,
        [selectedMember.userId]: triggers
      }));
      
      if (triggers.length === 0) {
        // If no triggers found but we have assigned some, show cached assigned triggers
        const assignedForMember = assignedTriggers[selectedMember.userId] || [];
        if (assignedForMember.length > 0) {
          console.log(`⚠️ API returned 0 triggers but we have ${assignedForMember.length} assigned locally`);
          setMemberTriggers(assignedForMember);
          toast.info(`⚠️ Hiển thị ${assignedForMember.length} trigger đã gán (backend chưa hỗ trợ lấy dữ liệu)`);
        } else {
          toast.info(`${selectedMember.displayName} chưa có yếu tố kích thích nào`);
        }
      }
    } catch (error) {
      console.error('❌ Error loading member triggers:', error);
      
      // Show cached assigned triggers if available
      const assignedForMember = assignedTriggers[selectedMember.userId] || [];
      if (assignedForMember.length > 0) {
        console.log(`⚠️ API failed but showing ${assignedForMember.length} assigned triggers from cache`);
        setMemberTriggers(assignedForMember);
        toast.info(`⚠️ Hiển thị ${assignedForMember.length} trigger đã gán (endpoint chưa sẵn sàng)`);
      } else {
        // Check if it's a 404 (endpoint not implemented) or other error
        if (error.message?.includes('endpoint not implemented') || error.message?.includes('No endpoint available')) {
          toast.info(`⚠️ Chưa thể tải yếu tố kích thích của ${selectedMember.displayName}. Tính năng đang được phát triển.`);
        } else {
          toast.warning(`⚠️ Chưa thể tải yếu tố kích thích của ${selectedMember.displayName}`);
        }
        setMemberTriggers([]);
      }
    }
  };

  const handleCreateTrigger = async () => {
    if (!newTriggerName.trim()) {
      toast.error('Vui lòng nhập tên yếu tố kích thích');
      return;
    }

    setLoading(true);
    try {
      await ApiHelper.createTriggerFactor(newTriggerName.trim());
      await loadAllTriggerFactors();
      setNewTriggerName('');
      setCreateDialogOpen(false);
      toast.success('✅ Đã tạo yếu tố kích thích mới');
    } catch (error) {
      console.error('Error creating trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndAssignToMember = async () => {
    if (!newTriggerName.trim()) {
      toast.error('Vui lòng nhập tên yếu tố kích thích');
      return;
    }

    if (!selectedMember) {
      toast.error('Vui lòng chọn thành viên');
      return;
    }

    setLoading(true);
    try {
      console.log(`🔄 Creating and assigning "${newTriggerName}" to member:`, selectedMember);
      
      const result = await ApiHelper.createAndAssignTriggerFactorToMember(newTriggerName.trim(), selectedMember.userId);
      
      console.log('✅ Successfully created and assigned trigger, result:', result);
      
      // Create a trigger object for local tracking
      const newTrigger = {
        triggerId: result.triggerId || result.id || Date.now(), // Fallback ID
        name: newTriggerName.trim(),
        createdAt: new Date().toISOString()
      };
      
      // Update local assigned triggers cache
      setAssignedTriggers(prev => ({
        ...prev,
        [selectedMember.userId]: [
          ...(prev[selectedMember.userId] || []),
          newTrigger
        ]
      }));
      
      // Update member triggers display immediately
      setMemberTriggers(prev => [...prev, newTrigger]);
      
      await Promise.all([
        loadAllTriggerFactors(),
        loadMemberTriggers() // This will merge with cache
      ]);
      
      setNewTriggerName('');
      setCreateDialogOpen(false);
      toast.success(`✅ Đã tạo và gán yếu tố kích thích cho ${selectedMember.displayName}`);
    } catch (error) {
      console.error('❌ Error creating and assigning trigger factor:', error);
      toast.error(error.message || 'Không thể tạo và gán yếu tố kích thích');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTriggersToMember = async () => {
    if (selectedTriggersToAssign.length === 0) {
      toast.error('Vui lòng chọn ít nhất một yếu tố kích thích');
      return;
    }

    if (!selectedMember) {
      toast.error('Vui lòng chọn thành viên');
      return;
    }

    setLoading(true);
    try {
      const triggerIds = selectedTriggersToAssign.map(t => t.triggerId);
      console.log(`🔄 Assigning triggers ${triggerIds} to member:`, selectedMember);
      
      await ApiHelper.assignTriggerFactorsToMember(selectedMember.userId, triggerIds);
      
      console.log('✅ Successfully assigned triggers, updating local cache...');
      
      // Update local assigned triggers cache
      setAssignedTriggers(prev => ({
        ...prev,
        [selectedMember.userId]: [
          ...(prev[selectedMember.userId] || []),
          ...selectedTriggersToAssign
        ]
      }));
      
      // Update member triggers display immediately
      setMemberTriggers(prev => [
        ...prev,
        ...selectedTriggersToAssign.filter(t => !prev.some(existing => existing.triggerId === t.triggerId))
      ]);
      
      await loadMemberTriggers(); // This will merge with cache
      
      setSelectedTriggersToAssign([]);
      setAssignDialogOpen(false);
      toast.success(`✅ Đã gán ${triggerIds.length} yếu tố kích thích cho ${selectedMember.displayName}`);
    } catch (error) {
      console.error('❌ Error assigning triggers to member:', error);
      toast.error(error.message || 'Không thể gán yếu tố kích thích');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrigger = async () => {
    if (!editTriggerName.trim()) {
      toast.error('Vui lòng nhập tên mới');
      return;
    }

    setLoading(true);
    try {
      await ApiHelper.updateTriggerFactor(editingTrigger.triggerId, { name: editTriggerName.trim() });
      await Promise.all([
        loadAllTriggerFactors(),
        loadMemberTriggers()
      ]);
      setEditDialogOpen(false);
      setEditingTrigger(null);
      setEditTriggerName('');
      toast.success('✅ Đã cập nhật yếu tố kích thích');
    } catch (error) {
      console.error('Error updating trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTriggerFromMember = async (triggerId) => {
    if (!window.confirm('Bạn có chắc muốn xóa yếu tố kích thích này khỏi thành viên?')) {
      return;
    }

    setLoading(true);
    try {
      await ApiHelper.removeTriggerFactorFromMember(triggerId);
      await loadMemberTriggers();
      toast.success('✅ Đã xóa yếu tố kích thích khỏi thành viên');
    } catch (error) {
      console.error('Error removing trigger from member:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrigger = async (triggerId) => {
    if (!window.confirm('Bạn có chắc muốn xóa hoàn toàn yếu tố kích thích này? Nó sẽ bị xóa khỏi tất cả thành viên.')) {
      return;
    }

    setLoading(true);
    try {
      await ApiHelper.deleteTriggerFactor(triggerId);
      await Promise.all([
        loadAllTriggerFactors(),
        loadMemberTriggers()
      ]);
      toast.success('✅ Đã xóa yếu tố kích thích');
    } catch (error) {
      console.error('Error deleting trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (trigger) => {
    setEditingTrigger(trigger);
    setEditTriggerName(trigger.name);
    setEditDialogOpen(true);
  };

  const getAvailableTriggersForAssignment = () => {
    const memberTriggerIds = memberTriggers.map(t => t.triggerId);
    return allTriggerFactors.filter(t => !memberTriggerIds.includes(t.triggerId));
  };

  if (!actions.isCoach) {
    return (
      <Alert severity="error">
        Chỉ huấn luyện viên mới có quyền truy cập trang này.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        🎯 Quản lý yếu tố kích thích
      </Typography>

      {/* User Role Information */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <strong>Quyền hạn:</strong> Huấn luyện viên - Có thể tạo, cập nhật, xóa và gán yếu tố kích thích cho thành viên
      </Alert>

      {/* TriggerFactor Management Section */}
      <Paper sx={{ p: 3 }}>

        <Grid container spacing={3}>
          {/* Member Selection */}
          <Grid item xs={12}>
            <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" gutterBottom>
                <PersonAddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Chọn Thành viên
              </Typography>
              <Autocomplete
                options={members}
                getOptionLabel={(member) => `${member.displayName} (${member.email})`}
                getOptionKey={(member) => member.userId} // Add unique key
                value={selectedMember}
                onChange={(event, newValue) => setSelectedMember(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn thành viên để quản lý"
                    placeholder="Tìm kiếm thành viên..."
                  />
                )}
                disabled={loading}
                isOptionEqualToValue={(option, value) => option.userId === value?.userId}
              />
            </Card>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thao tác
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                  disabled={loading}
                  color="primary"
                >
                  Tạo Yếu tố Mới
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<AssignIcon />}
                  onClick={() => setAssignDialogOpen(true)}
                  disabled={loading || !selectedMember}
                  color="secondary"
                >
                  Gán cho Thành viên
                </Button>
                
                {selectedMember && (assignedTriggers[selectedMember.userId]?.length > 0) && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setAssignedTriggers(prev => ({
                        ...prev,
                        [selectedMember.userId]: []
                      }));
                      setMemberTriggers([]);
                      toast.info('Đã xóa cache trigger factors');
                    }}
                    disabled={loading}
                    color="warning"
                    size="small"
                  >
                    Reset Cache
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>

          {/* Member's Trigger Factors */}
          {selectedMember && (
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Yếu tố của {selectedMember.displayName} ({memberTriggers.length})
                  {assignedTriggers[selectedMember.userId]?.length > 0 && (
                    <Chip 
                      label={`${assignedTriggers[selectedMember.userId].length} cached`} 
                      size="small" 
                      color="info" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Typography>
                
                {memberTriggers.length === 0 ? (
                  <Alert severity="info">Thành viên này chưa có yếu tố kích thích nào</Alert>
                ) : (
                  <List dense>
                    {memberTriggers.map((trigger) => (
                      <ListItem key={trigger.triggerId} divider>
                        <ListItemText
                          primary={trigger.name}
                          secondary={`ID: ${trigger.triggerId} | Created: ${new Date(trigger.createdAt).toLocaleDateString()}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => openEditDialog(trigger)}
                            disabled={loading}
                            size="small"
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveTriggerFromMember(trigger.triggerId)}
                            disabled={loading}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Card>
            </Grid>
          )}

          {/* All Trigger Factors */}
          <Grid item xs={12} md={selectedMember ? 6 : 12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tất cả Yếu tố Kích thích ({allTriggerFactors.length})
              </Typography>
              
              {allTriggerFactors.length === 0 ? (
                <Alert severity="info">Chưa có yếu tố kích thích nào trong hệ thống</Alert>
              ) : (
                <List dense>
                  {allTriggerFactors.map((trigger) => (
                    <ListItem key={trigger.triggerId} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {trigger.name}
                            {selectedMember && memberTriggers.some(mt => mt.triggerId === trigger.triggerId) && (
                              <Chip label="Đã gán" size="small" color="primary" />
                            )}
                          </Box>
                        }
                        secondary={`ID: ${trigger.triggerId} | Created: ${new Date(trigger.createdAt).toLocaleDateString()}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(trigger)}
                          disabled={loading}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTrigger(trigger.triggerId)}
                          disabled={loading}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Create Trigger Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo Yếu tố Kích thích Mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên yếu tố kích thích"
            fullWidth
            variant="outlined"
            value={newTriggerName}
            onChange={(e) => setNewTriggerName(e.target.value)}
            placeholder="Ví dụ: Căng thẳng công việc, Uống cà phê..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCreateTrigger} variant="outlined" disabled={loading}>
            Chỉ Tạo
          </Button>
          {selectedMember && (
            <Button onClick={handleCreateAndAssignToMember} variant="contained" disabled={loading}>
              Tạo & Gán cho {selectedMember.displayName}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Assign Triggers Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gán Yếu tố cho {selectedMember?.displayName}</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={getAvailableTriggersForAssignment()}
            getOptionLabel={(trigger) => trigger.name}
            value={selectedTriggersToAssign}
            onChange={(event, newValue) => setSelectedTriggersToAssign(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn yếu tố kích thích"
                placeholder="Chọn nhiều yếu tố..."
                sx={{ mt: 1 }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleAssignTriggersToMember} variant="contained" disabled={loading}>
            Gán
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Trigger Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật Yếu tố Kích thích</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên yếu tố kích thích"
            fullWidth
            variant="outlined"
            value={editTriggerName}
            onChange={(e) => setEditTriggerName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleUpdateTrigger} variant="contained" disabled={loading}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          🔄 Đang xử lý...
        </Alert>
      )}
    </Box>
  );
}
