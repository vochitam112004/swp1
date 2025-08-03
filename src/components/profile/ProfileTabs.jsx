import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Avatar,
  Button
} from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import api, { baseApiUrl } from "../../api/axios";
import AccountTab from "./tabs/AccountTab";
import SmokingHabitsTab from "./tabs/SmokingHabitsTab";
import HealthTab from "./tabs/HealthTab";
import BadgesTab from "./tabs/BadgesTab";
import "../../css/Profile.css";
import "../../css/ProfileTabs.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function ProfileTabs() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/User");
        const u = res.data;
        const mapped = {
          username: u.userName,
          displayName: u.displayName,
          avatarUrl: u.avatarUrl,
          email: u.email,
          phoneNumber: u.phoneNumber,
          address: u.address,
          userType: u.userType,
          createdAt: u.createdAt,
          isActive: u.isActive,
        };
        setProfile(mapped);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Không lấy được thông tin tài khoản!");
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch member profile for all users
  useEffect(() => {
    if (!user) return;

    const fetchMemberProfile = async () => {
      try {
        let res;
        try {
          res = await api.get("/MemberProfile/GetMyMemberProfile");
          setMemberProfile(res.data);
        } catch (error) {
          // If user doesn't have member profile, create empty one for display
          console.log("No member profile found, creating empty one");
          setMemberProfile({});
        }
      } catch (error) {
        console.error("Error fetching member profile:", error);
        setMemberProfile({});
      } finally {
        setLoading(false);
      }
    };

    fetchMemberProfile();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAvatarChange = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("UserName", profile.username);
    formData.append("DisplayName", profile.displayName);
    formData.append("Email", profile.email);
    formData.append("PhoneNumber", profile.phoneNumber || "");
    formData.append("Address", profile.address || "");
    formData.append("IsActive", profile.isActive ?? true);
    formData.append("AvatarFile", file);

    try {
      const res = await api.put("/User/My-Update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.avatarUrl || profile.avatarUrl;
      setProfile({ ...profile, avatarUrl: imageUrl });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại!");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography color="error">Không thể tải thông tin profile!</Typography>
      </Box>
    );
  }

  return (
    <Box className="profile-container">
      <Paper className="profile-paper" elevation={6}>
        {/* Header with Avatar */}
        <Box className="profile-avatar-container" sx={{ textAlign: 'center', p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Avatar
            src={
              profile.avatarUrl
                ? `${baseApiUrl}${profile.avatarUrl}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || profile.username)}`
            }
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h4" className="profile-name" sx={{ mb: 1 }}>
            {profile.displayName}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {profile.userType} • {profile.email}
          </Typography>
          <label>
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={(e) => handleAvatarChange(e.target.files[0])} 
            />
            <Button variant="outlined" component="span" size="medium">
              Đổi ảnh đại diện
            </Button>
          </label>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Thông tin tài khoản" {...a11yProps(0)} />
            <Tab label="Thông tin hút thuốc" {...a11yProps(1)} />
            <Tab label="Thông tin sức khỏe" {...a11yProps(2)} />
            <Tab label="Huy hiệu & Thành viên" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <AccountTab 
            profile={profile} 
            setProfile={setProfile}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <SmokingHabitsTab 
            memberProfile={memberProfile} 
            setMemberProfile={setMemberProfile}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <HealthTab 
            memberProfile={memberProfile} 
            setMemberProfile={setMemberProfile}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <BadgesTab />
        </TabPanel>
      </Paper>
    </Box>
  );
}