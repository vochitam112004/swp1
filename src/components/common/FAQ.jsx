import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../css/Footer.css";

export default function FAQ() {
  return (
    <div className="faq-bg">
      <div className="faq-container">
        <div className="faq-title" variant="h4" gutterBottom>
          Câu hỏi thường gặp
        </div>

        <Accordion className="faq-accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className="faq-accordion-summary"
          >
            <Typography className="faq-title">Làm sao để bắt đầu bỏ thuốc?</Typography>
          </AccordionSummary>
          <AccordionDetails className="faq-accordion-details">
            <Typography>
              Bạn có thể đăng ký tài khoản và chọn gói hỗ trợ để bắt đầu hành trình bỏ thuốc.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion className="faq-accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className="faq-accordion-summary"
          >
            <Typography className="faq-title">Ứng dụng có miễn phí không?</Typography>
          </AccordionSummary>
          <AccordionDetails className="faq-accordion-details">
            <Typography>
              Có một số tính năng miễn phí, và bạn có thể nâng cấp để có thêm hỗ trợ cá nhân hóa.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
