import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import researchArticles from "../../data/research";
import "../../css/Footer.css";

export default function Research() {
  const navigate = useNavigate();

  const handleReadMore = (id) => {
    navigate(`/research/${id}`);
  };

  return (
    <div className="research-bg">
      <div className="research-container">
        <Typography className="research-title" variant="h4" gutterBottom>
          Nghiên cứu & Tài liệu
        </Typography>

        {researchArticles.map((article) => (
          <div key={article.id} className="research-paper">
            <div className="research-card-info">
              <div className="research-card-title">{article.title}</div>
              <div className="research-card-author">{article.author}</div>
            </div>
            <Button
              variant="outlined"
              size="small"
              className="research-card-button"
              onClick={() => handleReadMore(article.id)}
            >
              ĐỌC BÀI
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
