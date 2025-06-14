import { Card, CardContent, Typography, Button, Box, Grid, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const plans = [
  {
    name: "Cơ bản",
    price: "Miễn phí",
    color: "secondary",
    features: [
      { text: "Theo dõi tình trạng hút thuốc", included: true },
      { text: "Kế hoạch cai thuốc cơ bản", included: true },
      { text: "Thống kê cơ bản", included: true },
      { text: "Hỗ trợ từ chuyên gia", included: false },
      { text: "Kế hoạch nâng cao", included: false },
    ],
    button: { text: "Sử dụng miễn phí", variant: "outlined", color: "secondary" },
  },
  {
    name: "Premium",
    price: "199,000đ",
    color: "primary",
    features: [
      { text: "Tất cả tính năng gói Cơ bản", included: true },
      { text: "Kế hoạch cai thuốc nâng cao", included: true },
      { text: "Nhắc nhở và động viên tức thì", included: true },
      { text: "2 buổi tư vấn với chuyên gia/tháng", included: true },
      { text: "Theo dõi sức khỏe chi tiết", included: true },
    ],
    button: { text: "Đăng ký ngay", variant: "contained", color: "primary" },
    chip: "Phổ biến",
  },
  {
    name: "VIP",
    price: "499,000đ",
    color: "error",
    features: [
      { text: "Tất cả tính năng gói Premium", included: true },
      { text: "5 buổi tư vấn với chuyên gia/tháng", included: true },
      { text: "Hỗ trợ 24/7 với huấn luyện viên", included: true },
      { text: "Kế hoạch cá nhân hóa cao", included: true },
      { text: "Phân tích sức khỏe chuyên sâu", included: true },
    ],
    button: { text: "Đăng ký VIP", variant: "contained", color: "error" },
  },
];

const Membership = () => (
  <Box sx={{ bgcolor: "#f8fafc", py: 8 }}>
    <Box className="container">
      <Box textAlign="center" mb={5}>
        <Typography variant="overline" color="primary" fontWeight={600} fontSize={18}>
          Gói thành viên
        </Typography>
        <Typography variant="h4" fontWeight={700} mt={1} color="text.primary">
          Lựa chọn gói phù hợp với bạn
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={2} maxWidth={700} mx="auto">
          Nâng cấp để mở khóa toàn bộ tính năng và hỗ trợ tốt nhất từ chuyên gia
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, idx) => (
          <Grid item xs={12} md={4} key={plan.name}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: idx === 1 ? 6 : 2,
                minWidth: 260,
                p: 2,
                position: "relative",
                border: idx === 1 ? "2px solid #1976d2" : "none",
                bgcolor: idx === 1 ? "#e3f2fd" : "#fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-8px)", boxShadow: 8 },
              }}
            >
              {plan.chip && (
                <Chip
                  label={plan.chip}
                  color="primary"
                  size="small"
                  sx={{ position: "absolute", top: 18, right: 18, fontWeight: 600 }}
                />
              )}
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700} color={plan.color} gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {plan.price}
                  {plan.name !== "Cơ bản" && (
                    <Typography component="span" color="text.secondary" fontSize={18}>
                      &nbsp;/tháng
                    </Typography>
                  )}
                </Typography>
                <Typography color="text.secondary" mb={2} mt={1}>
                  {plan.name === "Cơ bản"
                    ? "Bắt đầu hành trình cai thuốc"
                    : plan.name === "Premium"
                    ? "Tất cả tính năng hỗ trợ tốt nhất"
                    : "Hỗ trợ tối đa từ chuyên gia"}
                </Typography>
                <Box component="ul" sx={{ listStyle: "none", p: 0, mb: 3, width: "100%" }}>
                  {plan.features.map((f, i) => (
                    <Box
                      component="li"
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.2,
                        color: f.included ? "text.primary" : "text.disabled",
                        fontWeight: f.included ? 500 : 400,
                        fontSize: 16,
                      }}
                    >
                      {f.included ? (
                        <CheckIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <CloseIcon color="disabled" sx={{ mr: 1 }} />
                      )}
                      {f.text}
                    </Box>
                  ))}
                </Box>
                <Button
                  variant={plan.button.variant}
                  color={plan.button.color}
                  fullWidth
                  sx={{
                    mt: "auto",
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: 16,
                    py: 1.2,
                  }}
                >
                  {plan.button.text}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export default Membership;