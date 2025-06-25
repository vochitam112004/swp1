// src/pages/Unauthorized.jsx
import { Box, Typography } from "@mui/material";

export default function Unauthorized() {
  return (
    <Box p={4}>
      <Typography variant="h4" color="error">
        Không có quyền truy cập
      </Typography>
      <Typography mt={2}>Bạn không được phép truy cập vào trang này.</Typography>
    </Box>
  );
}
