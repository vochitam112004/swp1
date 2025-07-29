import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleAboutClick = () => navigate("/about");
  const handleBlogClick = () => navigate("/blog");
  const handleFAQClick = () => navigate("/faq");
  const handleResearchClick = () => navigate("/research");
  const handleMethodologyClick = () => navigate("/methodology");
  const handleContactClick = () => navigate("/contact");

  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row gy-4">
          <div className="col-6 col-md-3">
            <h3 className="text-uppercase fs-6 fw-semibold mb-3">Về chúng tôi</h3>
            <ul className="list-unstyled">
              <li>
                <button
                  onClick={handleAboutClick}
                  className="btn btn-link text-secondary text-decoration-none d-block mb-2 p-0"
                >
                  Giới thiệu
                </button>
              </li>
              <li>
                <button
                  onClick={handleMethodologyClick}
                  className="btn btn-link text-secondary text-decoration-none d-block p-0"
                >
                  Phương pháp
                </button>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-uppercase fs-6 fw-semibold mb-3">Tài nguyên</h3>
            <ul className="list-unstyled">
              <li>
                <button
                  onClick={handleBlogClick}
                  className="btn btn-link text-secondary text-decoration-none d-block mb-2 p-0"
                >
                  Blog chia sẻ
                </button>
              </li>
              <li>
                <button
                  onClick={handleResearchClick}
                  className="btn btn-link text-secondary text-decoration-none d-block mb-2 p-0"
                >
                  Nghiên cứu
                </button>
              </li>
              <li>
                <button
                  onClick={handleFAQClick}
                  className="btn btn-link text-secondary text-decoration-none d-block p-0"
                >
                  Câu hỏi thường gặp
                </button>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-uppercase fs-6 fw-semibold mb-3">Hỗ trợ</h3>
            <ul className="list-unstyled">
              <li>
                <button
                  onClick={handleContactClick}
                  className="btn btn-link text-secondary text-decoration-none d-block mb-2 p-0"
                >
                  Liên hệ
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-5 border-top border-secondary pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0 text-secondary text-center text-md-start">
            &copy; 2025 Breathe Free. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
