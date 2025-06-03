smoking-cessation-platform/
├── public/
│   └── # Các file tĩnh (favicon, images, etc.)
├── src/
│   ├── assets/ # Hình ảnh, fonts, icons SVGs
│   │   ├── images/
│   │   └── icons/
│   ├── components/ # Các UI components tái sử dụng
│   │   ├── common/ # Các components chung (Button, Input, Modal, Card, etc.)
│   │   │   ├── Button.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Spinner.jsx
│   │   ├── auth/ # Components liên quan đến xác thực
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── layout/ # Components cấu thành layout chính
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx # (Cho dashboard của Member, Coach, Admin)
│   │   └── features/ # Components đặc thù cho từng tính năng
│   │       ├── user/
│   │       │   └── ProfileCard.jsx
│   │       ├── quitting-plan/
│   │       │   └── PlanCreator.jsx
│   │       └── progress-tracking/
│   │           └── ProgressChart.jsx
│   ├── contexts/ # (Hoặc store/ nếu dùng Redux, Zustand)
│   │   └── AuthContext.jsx # Quản lý trạng thái đăng nhập
│   ├── features/ # Logic và UI chuyên biệt cho từng module lớn
│   │   ├── authentication/
│   │   │   ├── services/ # (auth.service.js - gọi API login, register)
│   │   │   ├── hooks/    # (useAuth.js - custom hook cho AuthContext)
│   │   │   └── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── user-profile/
│   │   │   ├── services/
│   │   │   ├── components/
│   │   │   └── UserProfilePage.jsx
│   │   └── # Các feature khác như QuittingPlan, Progress, Community...
│   ├── hooks/ # Custom React Hooks
│   │   └── useForm.js # Ví dụ hook cho quản lý form
│   ├── layouts/ # Các mẫu layout khác nhau cho ứng dụng
│   │   ├── MainLayout.jsx # Layout chính sau khi đăng nhập (có Navbar, Sidebar, Footer)
│   │   ├── AuthLayout.jsx # Layout cho trang đăng nhập, đăng ký
│   │   └── GuestLayout.jsx # Layout cho khách (trang chủ, blog khi chưa đăng nhập)
│   ├── pages/ # Các trang chính của ứng dụng (container components)
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── BlogPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── DashboardPage.jsx # Trang tổng quan cho Member/Coach/Admin
│   │   ├── SettingsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── router/
│   │   ├── index.jsx       # Cấu hình React Router
│   │   └── ProtectedRoute.jsx # Component bảo vệ route cần đăng nhập
│   ├── services/ # Các services gọi API (ngoài các service trong features)
│   │   └── apiClient.js # Cấu hình Axios hoặc Fetch client
│   ├── styles/
│   │   ├── global.css      # Các style global (nếu cần, ngoài Tailwind)
│   │   └── tailwind.css    # File Tailwind chính (thường là index.css hoặc app.css)
│   ├── utils/ # Các hàm tiện ích
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── App.jsx # Component gốc của ứng dụng
│   └── main.jsx # Điểm vào của ứng dụng
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js