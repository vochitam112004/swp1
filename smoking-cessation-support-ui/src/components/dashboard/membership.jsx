import { Card, CardContent, Typography, Button, Box, Grid, Chip, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const Membership = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(localStorage.getItem("membershipPaid") === "true");

  useEffect(() => {
    fetch("/api/memberships") // Đổi endpoint cho đúng backend của bạn
      .then((res) => res.json())
      .then((data) => {
        console.log("Membership plans:", data);
        setPlans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (plan) => {
    toast.success(`Bạn đã chọn gói "${plan.name}"!`);
    localStorage.setItem("membershipPaid", "true"); // Lưu trạng thái đã thanh toán
    navigate("/payment");
  };

  if (paid) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="primary">
          Bạn đã đăng ký gói thành viên!
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
                    {plan.description}
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
                        }}
                      >
                        {f.included ? (
                          <CheckIcon color="primary" sx={{ mr: 1 }} />
                        ) : (
                          <CloseIcon color="disabled" sx={{ mr: 1 }} />
                        )}
                        <Typography color={f.included ? "text.primary" : "text.disabled"}>
                          {f.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {plan.name === "Cơ bản" ? (
                    <Button
                      variant={plan.button.variant}
                      color={plan.button.color}
                      fullWidth
                      disabled
                    >
                      {plan.button.text}
                    </Button>
                  ) : (
                    <Button
                      variant={plan.button.variant}
                      color={plan.button.color}
                      fullWidth
                      onClick={() => handleSelect(plan)}
                    >
                      {plan.button.text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Membership;