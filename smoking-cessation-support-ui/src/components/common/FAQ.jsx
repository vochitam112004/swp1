import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQ() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Câu hỏi thường gặp</Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Làm sao để bắt đầu bỏ thuốc?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Bạn có thể đăng ký tài khoản và chọn gói hỗ trợ để bắt đầu hành trình bỏ thuốc.</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Ứng dụng có miễn phí không?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Có một số tính năng miễn phí, và bạn có thể nâng cấp để có thêm hỗ trợ cá nhân hóa.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
