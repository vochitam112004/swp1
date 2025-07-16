import React from "react";
import { Typography, Box, Paper, Link } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import "../../css/Footer.css";

export default function Contact() {
  return (
    <div className="contact-bg">
      <div className="contact-container">
        <Typography className="contact-title" variant="h4" gutterBottom>
          Thông tin liên hệ
        </Typography>

        <div className="contact-info" elevation={0}>
          <Box className="contact-row">
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography>SĐT: 0889 462 565</Typography>
          </Box>
          <Box className="contact-row">
            <EmailIcon sx={{ mr: 1 }} />
            <Typography>
              Email:{" "}
              <Link href="mailto:example@gmail.com" underline="hover" color="#4fc3f7">
                example@gmail.com
              </Link>
            </Typography>
          </Box>
          <Box className="contact-row">
            <LocationOnIcon sx={{ mr: 1 }} />
            <Typography>Địa chỉ: 123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM</Typography>
          </Box>
        </div>

        <div className="map-container">
          <iframe
            title="VNUHCM Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10546.759791708197!2d106.79153537636185!3d10.8673702347461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2sVNUHCM%20Student%20Cultural%20House!5e0!3m2!1sen!2s!4v1751524188705!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
