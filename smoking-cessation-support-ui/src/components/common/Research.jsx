import React from "react";
import { Typography, Paper } from "@mui/material";
import "../../css/Footer.css";

export default function Research() {
  return (
    <div className="research-bg">
      <div className="research-container">
        <Typography className="research-title" variant="h4" gutterBottom>
          Nghiên cứu & Tài liệu
        </Typography>

        <Paper className="research-paper">
          <Typography variant="h6">Hiệu quả của hỗ trợ kỹ thuật số trong cai thuốc</Typography>
          <Typography variant="body2" gutterBottom>
            J. Smith et al., 2023
          </Typography>
          <Typography>
            Ứng dụng đã giúp tăng gấp đôi tỷ lệ bỏ thuốc trong vòng 12 tuần.
          </Typography>
        </Paper>

        <Paper className="research-paper">
          <Typography variant="h6">Tâm lý học hành vi trong hỗ trợ cai thuốc</Typography>
          <Typography variant="body2" gutterBottom>
            Nguyễn Văn Dũng, 2022
          </Typography>
          <Typography>
            Kỹ thuật CBT giúp người dùng vượt qua cơn thèm thuốc và duy trì động lực.
          </Typography>
        </Paper>
      </div>
    </div>
  );
}
