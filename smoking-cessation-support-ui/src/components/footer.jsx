import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate("/about");
  };

  const handleBlogClick = () => {
    navigate("/blog");
  };

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
              <li><a href="#" className="text-secondary text-decoration-none d-block mb-2">Đội ngũ</a></li>
              <li><a href="#" className="text-secondary text-decoration-none d-block">Phương pháp</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-uppercase fs-6 fw-semibold mb-3">Tài nguyên</h3>
            <ul className="list-unstyled">
              <li><button
                  onClick={handleBlogClick}
                  className="btn btn-link text-secondary text-decoration-none d-block mb-2 p-0"
                >
                  Blog chia sẻ
                </button></li>
              <li><a href="#" className="text-secondary text-decoration-none d-block mb-2">Nghiên cứu</a></li>
              <li><a href="#" className="text-secondary text-decoration-none d-block">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-uppercase fs-6 fw-semibold mb-3">Hỗ trợ</h3>
            <ul className="list-unstyled">
              <li><a href="#" className="text-secondary text-decoration-none d-block mb-2">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="text-secondary text-decoration-none d-block mb-2">Liên hệ</a></li>
              <li><a href="#" className="text-secondary text-decoration-none d-block">Tư vấn chuyên gia</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-uppercase fs-6 fw-semibold mb-3">Kết nối</h3>
            <div className="mb-3 d-flex gap-3">
              <a href="#" className="text-secondary fs-4"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-secondary fs-4"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-secondary fs-4"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-secondary fs-4"><i className="fab fa-youtube"></i></a>
            </div>
            <h3 className="fs-6 fw-semibold mb-2">Tải ứng dụng</h3>
            <div className="d-flex gap-2">
              <a href="#"><img style={{ height: 40 }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1200px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" /></a>
              <a href="#"><img style={{ height: 40 }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" /></a>
            </div>
          </div>
        </div>
        <div className="mt-5 border-top border-secondary pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0 text-secondary text-center text-md-start">
            &copy; 2023 Breathe Free. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            <a href="#" className="text-secondary text-decoration-none">Chính sách bảo mật</a>
            <a href="#" className="text-secondary text-decoration-none">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
