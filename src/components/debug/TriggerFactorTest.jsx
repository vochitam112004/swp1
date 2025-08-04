import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Chip,
  Grid
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { TriggerFactorService } from '../../../api/triggerFactorService';
import ApiHelper from '../../../utils/apiHelper';
import { useAuth } from '../../auth/AuthContext';
import { getAvailableActions } from '../../../utils/triggerFactorPermissions';

/**
 * TriggerFactor API Test Component
 * This component tests all TriggerFactor API endpoints according to Swagger specification
 */
export default function TriggerFactorTest() {
  const { user } = useAuth();
  const actions = getAvailableActions(user);
  
  const [myTriggerFactors, setMyTriggerFactors] = useState([]);
  const [allTriggerFactors, setAllTriggerFactors] = useState([]);
  const [newTriggerName, setNewTriggerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState(null);
  const [editName, setEditName] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMyTriggerFactors(),
        loadAllTriggerFactors()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyTriggerFactors = async () => {
    try {
      const triggers = await ApiHelper.fetchMyTriggerFactors();
      setMyTriggerFactors(triggers);
      console.log('✅ My Trigger Factors loaded:', triggers);
    } catch (error) {
      console.error('❌ Error loading my trigger factors:', error);
      toast.error(error.message);
    }
  };

  const loadAllTriggerFactors = async () => {
    if (!actions.canViewAll) {
      console.log('User does not have permission to view all trigger factors');
      return;
    }
    
    try {
      const triggers = await ApiHelper.fetchAllTriggerFactors();
      setAllTriggerFactors(triggers);
      console.log('✅ All Trigger Factors loaded:', triggers);
    } catch (error) {
      console.error('❌ Error loading all trigger factors:', error);
      toast.error(error.message);
    }
  };

  const handleCreateTrigger = async () => {
    if (!actions.canCreate) {
      toast.error('You do not have permission to create trigger factors');
      return;
    }

    if (!newTriggerName.trim()) {
      toast.error('Vui lòng nhập tên yếu tố kích thích');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Creating trigger factor:', newTriggerName);
      await ApiHelper.createTriggerFactor(newTriggerName.trim());
      setNewTriggerName('');
      await loadAllTriggerFactors();
      toast.success('✅ Đã tạo yếu tố kích thích mới');
    } catch (error) {
      console.error('❌ Error creating trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndAssignTrigger = async () => {
    if (!actions.canAssignToMember) {
      toast.error('You do not have permission to assign trigger factors to members');
      return;
    }

    if (!newTriggerName.trim()) {
      toast.error('Vui lòng nhập tên yếu tố kích thích');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Creating and assigning trigger factor:', newTriggerName);
      await ApiHelper.createAndAssignTriggerFactor(newTriggerName.trim());
      setNewTriggerName('');
      await loadAllData();
      toast.success('✅ Đã tạo và gán yếu tố kích thích mới');
    } catch (error) {
      console.error('❌ Error creating and assigning trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTrigger = async (triggerId) => {
    setLoading(true);
    try {
      console.log('🔄 Assigning trigger factor:', triggerId);
      await ApiHelper.assignTriggerFactorsToCurrentUser([triggerId]);
      await loadMyTriggerFactors();
      toast.success('✅ Đã gán yếu tố kích thích');
    } catch (error) {
      console.error('❌ Error assigning trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrigger = async (triggerId) => {
    if (!actions.canRemoveFromMember) {
      toast.error('You do not have permission to remove trigger factors');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Removing trigger factor from member:', triggerId);
      await ApiHelper.removeTriggerFactorFromMember(triggerId);
      await loadMyTriggerFactors();
      toast.success('✅ Đã xóa yếu tố kích thích khỏi danh sách của bạn');
    } catch (error) {
      console.error('❌ Error removing trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTrigger = async (triggerId) => {
    if (!actions.canUpdate) {
      toast.error('You do not have permission to update trigger factors');
      return;
    }

    if (!editName.trim()) {
      toast.error('Vui lòng nhập tên mới');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Updating trigger factor:', triggerId, editName);
      await ApiHelper.updateTriggerFactor(triggerId, { name: editName.trim() });
      await loadAllData();
      setEditingTrigger(null);
      setEditName('');
      toast.success('✅ Đã cập nhật yếu tố kích thích');
    } catch (error) {
      console.error('❌ Error updating trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrigger = async (triggerId) => {
    if (!actions.canDelete) {
      toast.error('You do not have permission to delete trigger factors');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn xóa hoàn toàn yếu tố kích thích này?')) {
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Deleting trigger factor:', triggerId);
      await ApiHelper.deleteTriggerFactor(triggerId);
      await loadAllData();
      toast.success('✅ Đã xóa yếu tố kích thích');
    } catch (error) {
      console.error('❌ Error deleting trigger factor:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (trigger) => {
    setEditingTrigger(trigger.triggerId);
    setEditName(trigger.name);
  };

  const cancelEdit = () => {
    setEditingTrigger(null);
    setEditName('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 TriggerFactor API Test
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Component này dùng để test tất cả API endpoints của TriggerFactor theo Swagger specification.
      </Alert>

      <Grid container spacing={3}>
        {/* Create New Trigger */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tạo Yếu Tố Kích Thích Mới
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Tên yếu tố kích thích"
                value={newTriggerName}
                onChange={(e) => setNewTriggerName(e.target.value)}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {actions.canCreate && (
                <Button
                  variant="contained"
                  onClick={handleCreateTrigger}
                  disabled={loading || !newTriggerName.trim()}
                  startIcon={<AddIcon />}
                >
                  Chỉ Tạo
                </Button>
              )}
              {actions.canAssignToMember && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCreateAndAssignTrigger}
                  disabled={loading || !newTriggerName.trim()}
                  startIcon={<AddIcon />}
                >
                  Tạo & Gán Cho Tôi
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* My Trigger Factors */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Yếu Tố Kích Thích Của Tôi ({myTriggerFactors.length})
            </Typography>
            <Button 
              variant="outlined" 
              onClick={loadMyTriggerFactors} 
              disabled={loading}
              sx={{ mb: 2 }}
            >
              🔄 Refresh
            </Button>
            
            {myTriggerFactors.length === 0 ? (
              <Alert severity="info">Bạn chưa có yếu tố kích thích nào</Alert>
            ) : (
              <List dense>
                {myTriggerFactors.map((trigger) => (
                  <ListItem key={trigger.triggerId} divider>
                    <ListItemText
                      primary={trigger.name}
                      secondary={`ID: ${trigger.triggerId} | Created: ${new Date(trigger.createdAt).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      {actions.canRemoveFromMember && (
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveTrigger(trigger.triggerId)}
                          disabled={loading}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* All Trigger Factors */}
        {actions.canViewAll && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tất Cả Yếu Tố Kích Thích ({allTriggerFactors.length})
              </Typography>
              <Button 
                variant="outlined" 
                onClick={loadAllTriggerFactors} 
                disabled={loading}
                sx={{ mb: 2 }}
              >
                🔄 Refresh
              </Button>
            
            {allTriggerFactors.length === 0 ? (
              <Alert severity="info">Chưa có yếu tố kích thích nào trong hệ thống</Alert>
            ) : (
              <List dense>
                {allTriggerFactors.map((trigger) => (
                  <ListItem key={trigger.triggerId} divider>
                    <ListItemText
                      primary={
                        editingTrigger === trigger.triggerId ? (
                          <TextField
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            size="small"
                            fullWidth
                          />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {trigger.name}
                            {myTriggerFactors.some(mt => mt.triggerId === trigger.triggerId) && (
                              <Chip label="Của tôi" size="small" color="primary" />
                            )}
                          </Box>
                        )
                      }
                      secondary={`ID: ${trigger.triggerId} | Created: ${new Date(trigger.createdAt).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {editingTrigger === trigger.triggerId ? (
                          <>
                            <Button
                              size="small"
                              onClick={() => handleUpdateTrigger(trigger.triggerId)}
                              disabled={loading}
                            >
                              Lưu
                            </Button>
                            <Button
                              size="small"
                              onClick={cancelEdit}
                              disabled={loading}
                            >
                              Hủy
                            </Button>
                          </>
                        ) : (
                          <>
                            {actions.canUpdate && (
                              <IconButton
                                size="small"
                                onClick={() => startEdit(trigger)}
                                disabled={loading}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            {actions.canAssignToMember && !myTriggerFactors.some(mt => mt.triggerId === trigger.triggerId) && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleAssignTrigger(trigger.triggerId)}
                                disabled={loading}
                              >
                                Gán cho tôi
                              </Button>
                            )}
                            {actions.canDelete && (
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTrigger(trigger.triggerId)}
                                disabled={loading}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </>
                        )}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        )}
      </Grid>

      {loading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          🔄 Đang xử lý...
        </Alert>
      )}
    </Box>
  );
}
