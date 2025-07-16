import React from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import "../../css/Footer.css";

export default function Methodology() {
  return (
    <div className="methodology-bg">
      <div className="methodology-container">
        <Typography className="methodology-title" variant="h4" gutterBottom>
          Phương pháp hỗ trợ cai nghiện thuốc lá
        </Typography>

        <div className="methodology-paper">
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Nền tảng <strong>Breathe Free</strong> áp dụng các phương pháp khoa học và cá nhân hóa nhằm tối ưu hiệu quả trong quá trình hỗ trợ người dùng từ bỏ thuốc lá và thuốc lá điện tử. Chúng tôi kết hợp công nghệ với sự đồng hành của chuyên gia để mang lại giải pháp toàn diện.
          </Typography>

          <List className="methodology-list">
            <ListItem>
              <ListItemText
                primary="🌱 Cá nhân hóa kế hoạch cai thuốc"
                secondary="Dựa trên tình trạng hút thuốc, động lực và thói quen cá nhân, hệ thống xây dựng lộ trình phù hợp cho từng thành viên."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="🧠 Ứng dụng kỹ thuật hành vi & CBT"
                secondary="Chúng tôi sử dụng phương pháp trị liệu hành vi nhận thức (Cognitive Behavioral Therapy - CBT) để xử lý cơn thèm thuốc và thay đổi thói quen."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="🤝 Tư vấn 1:1 cùng huấn luyện viên"
                secondary="Người dùng có thể trò chuyện trực tiếp với các huấn luyện viên được đào tạo để nhận sự hỗ trợ, động viên và giải đáp cá nhân."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="📊 Theo dõi tiến trình và phản hồi liên tục"
                secondary="Nền tảng giúp bạn ghi lại tình trạng sức khỏe, số lượng điếu thuốc, tiền tiết kiệm… từ đó đưa ra phản hồi và huy hiệu thành tích nhằm duy trì động lực."
              />
            </ListItem>
          </List>
        </div>
      </div>
    </div>
  );
}
//