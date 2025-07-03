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

        <Paper className="contact-info" elevation={0}>
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
        </Paper>

        <div className="map-container">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2133513641695!2d106.67998397587448!3d10.794800089354314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752930e41647cd%3A0x354cce3154c2e9e3!2zMTIzIMSQLiBOZ3V54buFbiBWxINuIEPGrSwgUXXhuq1uIDUsIFF14bqtbiAxLCBUaOG7pyBUaOG6p24gSG8gQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1688356560000!5m2!1sen!2s"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
