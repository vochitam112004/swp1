import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CoachMemberProfileEditor from "./CoachMemberProfileEditor";
import api, { baseApiUrl } from "../../api/axios";
import MemberProfileService from "../../api/memberProfileService";

export default function UserProfileCard({ user, onProfileUpdate }) {
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchMemberProfile = async () => {
      try {
        const memberProfileData = await MemberProfileService.getMemberProfileByUserId(user.userId);
        setMemberProfile(memberProfileData);
      } catch (error) {
        console.error("Không thể lấy thông tin member profile:", error);
        setMemberProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberProfile();
  }, [user]);

  const handleProfileUpdate = (updatedProfile) => {
    setMemberProfile(updatedProfile);
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography>Đang tải...</Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative"
        }}
      >
        {/* Header với avatar và thông tin cơ bản */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src={
              user?.avatarUrl
                ? `${baseApiUrl}${user.avatarUrl}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.userName || "")}`
            }
            sx={{ width: 80, height: 80 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              {user?.displayName || user?.userName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Tên đăng nhập: {user?.userName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Loại người dùng: {user?.userType || "Member"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              SĐT: {user?.phoneNumber || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Địa chỉ: {user?.address || "N/A"}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 2 }} />

        {/* Thông tin hút thuốc */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
              🚬 Thông tin hút thuốc
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
              sx={{ 
                color: "white", 
                borderColor: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white"
                }
              }}
            >
              Chỉnh sửa thông tin
            </Button>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                ĐIẾU THUỐC MỖI NGÀY
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {memberProfile?.dailyCigarettes || 0}
              </Typography>
              <Typography variant="body2">điếu</Typography>
            </Box>

            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                SỐ NĂM HÚT THUỐC
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {memberProfile?.yearsOfSmoking || 0}
              </Typography>
              <Typography variant="body2">năm</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                GIÁ 1 GÓI THUỐC
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {memberProfile?.packPrice || 0}
              </Typography>
              <Typography variant="body2">VNĐ</Typography>
            </Box>

            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                ĐIẾU TRONG 1 GÓI
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {memberProfile?.cigarettesPerPack || 0}
              </Typography>
              <Typography variant="body2">điếu</Typography>
            </Box>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.8, mt: 2 }}>
          Ngày tạo: {formatDate(user?.createdAt)}
        </Typography>
      </Paper>

      {/* Dialog chỉnh sửa thông tin */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={false}
        PaperProps={{
          sx: { minHeight: '80vh', maxHeight: '90vh' }
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Chỉnh sửa thông tin - {user?.displayName}
            </Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <CoachMemberProfileEditor 
              key={memberProfile?.memberId || 'editor'}
              memberProfile={memberProfile} 
              setMemberProfile={handleProfileUpdate}
              onClose={() => setEditDialogOpen(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
