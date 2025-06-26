import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import api from "../../api/axios";

export default function UserProgress() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get("/Coach/user-progress").then((res) => setProgress(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h6">Tiến trình người dùng</Typography>
      <List>
        {progress.map((p, i) => (
          <ListItem key={i}>
            <ListItemText primary={`${p.userName} - ${p.daysNoSmoke} ngày không hút`} secondary={`Sức khỏe: ${p.healthScore}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}