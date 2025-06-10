import { Box, Typography } from "@mui/material";

export default function Blog() {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h3" fontWeight={700} color="primary" mb={2}>
        Blog
      </Typography>
      <Typography color="text.secondary">
        Nội dung blog sẽ được cập nhật tại đây.
      </Typography>
    </Box>
  );
}