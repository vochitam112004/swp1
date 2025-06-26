import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import api from "../../api/axios";

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/Feedback/list");
      setFeedbacks(res.data);
    };
    fetch();
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={2}>Phản hồi từ người dùng</Typography>
      <List>
        {feedbacks.map((f, i) => (
          <ListItem key={i}>
            <ListItemText primary={f.userName} secondary={f.message} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}