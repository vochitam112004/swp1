import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Avatar,
} from "@mui/material";

const blogPosts = [
  {
    id: 1,
    title: "5 Bước Đầu Tiên Để Cai Thuốc Lá Thành Công",
    summary:
      "Khám phá các bước cơ bản giúp bạn bắt đầu hành trình bỏ thuốc lá hiệu quả và bền vững.",
    author: "Nguyễn Thành Lợi",
    date: "2024-06-01",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    title: "Lợi Ích Sức Khỏe Khi Ngừng Hút Thuốc",
    summary:
      "Tìm hiểu những thay đổi tích cực về sức khỏe mà bạn sẽ nhận được ngay sau khi bỏ thuốc.",
    author: "Trần Đinh Phong",
    date: "2024-05-20",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    title: "Cách Vượt Qua Cơn Thèm Thuốc",
    summary:
      "Những mẹo thực tế giúp bạn kiểm soát và vượt qua các cơn thèm thuốc trong quá trình cai.",
    author: "Võ Chí Tâm",
    date: "2024-05-10",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export default function Blog() {
  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 1100, mx: "auto" }}>
      <Typography
        variant="h3"
        fontWeight={700}
        color="primary"
        mb={4}
        textAlign="center"
      >
        Tin tức
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={4} key={post.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {post.title}
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  {post.summary}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={1}
                >
                  <Avatar
                    src={post.avatar}
                    sx={{ width: 28, height: 28 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {post.author} &nbsp;|&nbsp;{" "}
                    {new Date(post.date).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  fullWidth
                >
                  Xem chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}