import { Box, Typography } from "@mui/material";

export default function BXH() {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h3" fontWeight={700} color="primary" mb={2}>
        Bảng xếp hạng
      </Typography>
      <Typography color="text.secondary">
        Bảng xếp hạng thành viên sẽ hiển thị tại đây.
      </Typography>
    </Box>
  );
}