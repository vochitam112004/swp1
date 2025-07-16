import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import researchArticles from "../../data/research";
import "../../css/Footer.css"; // hoặc import ResearchDetail.css nếu tách riêng

export default function ResearchDetail() {
  const { id } = useParams();
  const article = researchArticles.find((item) => item.id === id);

  if (!article) {
    return (
      <Container sx={{ padding: "32px 0" }}>
        <Typography variant="h6">Không tìm thấy bài nghiên cứu.</Typography>
      </Container>
    );
  }

  // Phân tích nội dung dạng đoạn văn và bullet
  const paragraphs = article.content.split("\n").map((para, index) => {
    if (para.trim().startsWith("◆")) {
      return (
        <div className="research-detail-bullet" key={index}>
          {para.replace(/^◆\s*/, "")}
        </div>
      );
    } else {
      return (
        <p className="research-detail-paragraph" key={index}>
          {para}
        </p>
      );
    }
  });

  return (
    <div className="research-detail-container">
      <Typography className="research-detail-title"
        variant="h4" gutterBottom >
        {article.title}
      </Typography>

      <Typography className="research-detail-author" gutterBottom>
        {article.author}
      </Typography>

      {paragraphs}
    </div>
  );
}
