import React, { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Box, Chip, Switch } from "@mui/material";

const NOTIFICATION_TYPES = {
  MOTIVATION: "motivation",
  REMINDER: "reminder",
  HEALTH: "health",
  ACHIEVEMENT: "achievement",
  MILESTONE: "milestone",
};

const DEFAULT_SETTINGS = {
  enableBrowserNotifications: true,
  enableMotivationMessages: true,
  enableHealthTips: true,
  enableMilestoneNotifications: true,
  enableAchievementNotifications: true,
};

export default function NotificationHistory() {
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("notificationSettings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("notificationHistory") || "[]");
    setHistory(data.reverse());
  }, []);

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Cài đặt thông báo</Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={2}>
            <Switch
              checked={settings.enableBrowserNotifications}
              onChange={e => setSettings(s => ({ ...s, enableBrowserNotifications: e.target.checked }))}
            />
            <span>Bật thông báo trình duyệt</span>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Switch
              checked={settings.enableMotivationMessages}
              onChange={e => setSettings(s => ({ ...s, enableMotivationMessages: e.target.checked }))}
            />
            <span>Nhận thông báo động viên</span>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Switch
              checked={settings.enableHealthTips}
              onChange={e => setSettings(s => ({ ...s, enableHealthTips: e.target.checked }))}
            />
            <span>Nhận thông báo sức khỏe</span>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Switch
              checked={settings.enableMilestoneNotifications}
              onChange={e => setSettings(s => ({ ...s, enableMilestoneNotifications: e.target.checked }))}
            />
            <span>Nhận thông báo cột mốc</span>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Switch
              checked={settings.enableAchievementNotifications}
              onChange={e => setSettings(s => ({ ...s, enableAchievementNotifications: e.target.checked }))}
            />
            <span>Nhận thông báo huy hiệu</span>
          </Box>
        </Box>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography variant="h6" flex={1}>Lịch sử thông báo</Typography>
          <FormControl size="small">
            <InputLabel>Loại</InputLabel>
            <Select
              value={filterType}
              label="Loại"
              onChange={e => setFilterType(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value={NOTIFICATION_TYPES.MOTIVATION}>Động viên</MenuItem>
              <MenuItem value={NOTIFICATION_TYPES.REMINDER}>Nhắc nhở</MenuItem>
              <MenuItem value={NOTIFICATION_TYPES.HEALTH}>Sức khỏe</MenuItem>
              <MenuItem value={NOTIFICATION_TYPES.ACHIEVEMENT}>Huy hiệu</MenuItem>
              <MenuItem value={NOTIFICATION_TYPES.MILESTONE}>Cột mốc</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {history.length === 0 ? (
          <Typography color="text.secondary">Chưa có lịch sử thông báo.</Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {history
              .filter(n => filterType === "all" || n.type === filterType)
              .map((notification, idx) => (
                <ListItem key={idx} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip size="small" label={notification.type} />
                        <span>{notification.title}</span>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">{notification.message}</Typography>
                        <Typography variant="caption" color="text.disabled">
                          {new Date(notification.timestamp).toLocaleString("vi-VN")}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Paper>
    </>
  );
}