🌳 Thư mục Gốc (smoking-cessation-platform/)
Đây là nơi chứa toàn bộ mã nguồn và các file cấu hình của dự án.

public/: 🏞️
Chứa các file tĩnh không cần qua quá trình build của Vite. Ví dụ: favicon.ico, hình ảnh logo tĩnh, file robots.txt, manifest.json, etc. Các file này sẽ được copy trực tiếp vào thư mục build cuối cùng (dist).
src/: ❤️ Đây là thư mục làm việc chính của bạn, chứa toàn bộ mã nguồn JavaScript/JSX, CSS, và các tài sản khác của ứng dụng React.

assets/: 🖼️🎵
Chứa các tài sản tĩnh như hình ảnh (images/), biểu tượng SVG (icons/), phông chữ, etc., mà bạn sẽ import và sử dụng trong các component. Vite sẽ xử lý và tối ưu hóa các tài sản này trong quá trình build.
components/: 🧩

Nơi chứa các UI component tái sử dụng được. Việc chia nhỏ giao diện thành các component giúp quản lý code dễ dàng, tăng khả năng tái sử dụng và bảo trì.

common/: ⚙️ Các component chung, nhỏ, và có thể dùng ở bất kỳ đâu (ví dụ: Button.jsx, InputField.jsx, Modal.jsx, Spinner.jsx). Chúng thường không có logic nghiệp vụ cụ thể.

auth/: 🔑 Các component liên quan đến xác thực (ví dụ: LoginForm.jsx, RegisterForm.jsx).

layout/: 🏗️ Các component cấu thành bố cục chính của trang (ví dụ: Navbar.jsx, Footer.jsx, Sidebar.jsx).

features/: ✨ Các component đặc thù cho từng tính năng lớn, nhưng vẫn mang tính chất UI thuần túy và có thể tái 
sử dụng trong feature đó (ví dụ: user/ProfileCard.jsx, quitting-plan/PlanCreator.jsx). Lưu ý: Có một thư mụ

 src/features/ khác ở cấp cao hơn dùng để chứa toàn bộ logic và UI của một module lớn.

contexts/: 🔄 (Hoặc store/ nếu dùng Redux, Zustand)
Chứa các React Context để quản lý trạng thái toàn cục hoặc chia sẻ dữ liệu giữa các component mà không cần truyền props qua nhiều cấp (prop drilling). 
Ví dụ quan trọng là AuthContext.jsx để quản lý trạng thái đăng nhập.

features/: 🚀 (Cấp cao)
Đây là một cách tổ chức code theo module hoặc tính năng lớn. Mỗi thư mục con trong này sẽ đại diện cho một tính năng hoàn chỉnh 
(ví dụ: authentication/, user-profile/, quitting-plan/).
 Bên trong mỗi feature, bạn có thể có các thư mục con như:

components/: Các UI component chỉ dùng riêng cho feature này.

services/: Logic gọi API liên quan đến feature này (ví dụ: auth.service.js).

hooks/: Các custom hook chỉ dùng cho feature này.
Các file page hoặc component chính của feature 
(ví dụ: LoginPage.jsx).
Cách tổ chức này giúp code dễ mở rộng và bảo trì, vì mọi thứ liên quan đến một tính năng được gom lại một chỗ.

hooks/: 🎣
Chứa các custom React Hook tái sử dụng được trên toàn ứng dụng. Custom hook giúp tách biệt logic phức tạp ra khỏi component, làm cho component gọn gàng hơn. Ví dụ: useForm.js để quản lý trạng thái và validation của form.

layouts/: 📐
Chứa các component định nghĩa cấu trúc bố cục chung cho các nhóm trang khác nhau. Ví dụ:

MainLayout.jsx: Bố cục cho các trang sau khi người dùng đăng nhập (thường có Navbar, Sidebar, Footer).

AuthLayout.jsx: Bố cục cho các trang đăng nhập, đăng ký (thường đơn giản, nội dung ở giữa).

GuestLayout.jsx: Bố cục cho các trang khách truy cập (ví dụ: trang chủ, blog khi chưa đăng nhập).


pages/: 📄
Chứa các component cấp cao nhất đại diện cho từng trang của ứng dụng. Mỗi file trong này thường tương ứng với một route. Các page component có nhiệm vụ kết hợp nhiều UI component nhỏ hơn lại với nhau và xử lý logic dữ 
liệu cho trang đó. Ví dụ: HomePage.jsx, LoginPage.jsx, DashboardPage.jsx.


router/: 🗺️
Chứa các file liên quan đến việc định tuyến (routing) trong ứng dụng.

index.jsx: File chính cấu hình các route sử dụng thư viện react-router-dom.

ProtectedRoute.jsx: Component đặc biệt để bảo vệ các route yêu cầu người dùng phải đăng nhập (và có thể kiểm tra cả vai trò).

services/: 📡
Chứa logic tương tác với API backend hoặc các dịch vụ bên ngoài.

apiClient.js: File cấu hình client HTTP (ví dụ: sử dụng Axios hoặc Fetch) với các cài đặt chung như base URL, headers mặc định, interceptor để xử lý lỗi hoặc token.

Các file service khác có thể được đặt ở đây nếu chúng mang tính toàn cục, hoặc đặt trong thư mục services/ của từng features/ nếu chúng đặc thù cho feature đó.

styles/: 🎨
Chứa các file CSS toàn cục.

tailwind.css (hoặc index.css, app.css): File CSS chính nơi bạn import các chỉ thị @tailwind base;, @tailwind components;, @tailwind utilities; của Tailwind CSS.

global.css: Nếu bạn cần viết thêm các style CSS tùy chỉnh toàn cục không thuộc Tailwind.

utils/: 🛠️
Chứa các hàm tiện ích nhỏ, thuần túy (pure functions) có thể tái sử dụng ở nhiều nơi trong ứng dụng.

 Ví dụ: helpers.js (các hàm định dạng ngày tháng, xử lý chuỗi), validators.js (các hàm kiểm tra tính hợp lệ của dữ liệu).

App.jsx:
Component gốc của ứng dụng React. Nó thường chứa cấu trúc layout cơ bản (ví dụ: Navbar, Footer chung) và Outlet từ react-router-dom để render các page component tương ứng với route hiện tại.

main.jsx: 🚀 Điểm vào (entry point) của ứng dụng. File này render component App (hoặc AppRouter) vào DOM và thiết lập các Provider toàn cục (như AuthProvider, Redux Provider).


📄 Các File Cấu hình ở Thư mục Gốc:

.eslintrc.cjs (hoặc .eslintrc.json): File cấu hình cho ESLint, một công cụ phân tích mã tĩnh để tìm và sửa các vấn đề trong code JavaScript/React.

.gitignore: Liệt kê các file và thư mục mà Git nên bỏ qua khi theo dõi thay đổi (ví dụ: node_modules/, .env, thư mục dist/).

index.html: File HTML duy nhất của ứng dụng SPA (Single Page Application). React sẽ inject nội dung vào thẻ div có id="root" (hoặc tương tự) trong file này. Vite sử dụng file này làm mẫu trong quá trình phát triển và build.

package.json: 📦 File quan trọng của mọi dự án Node.js. Nó chứa:
Metadata của dự án (tên, phiên bản, mô tả).

Danh sách các dependencies (thư viện cần cho lúc chạy ứng dụng) và devDependencies (thư viện cần cho lúc phát triển, ví dụ: Vite, Tailwind, ESLint).

Các scripts để chạy các tác vụ (ví dụ: npm run dev để khởi động server phát triển, npm run build để build ứng dụng).

postcss.config.js: File cấu hình cho PostCSS, một công cụ biến đổi CSS bằng JavaScript plugin. Tailwind CSS là một plugin của PostCSS.

tailwind.config.js: File cấu hình chính cho Tailwind CSS. Tại đây bạn tùy chỉnh theme (màu sắc, font chữ, spacing), thêm plugin, và quan trọng nhất là khai báo đường dẫn đến các file mã nguồn (content) để Tailwind có thể quét và tạo ra các class CSS cần thiết.

vite.config.js: File cấu hình cho Vite, công cụ build và server phát triển của dự án. Bạn có thể cấu hình

plugin, alias đường dẫn, proxy server, và nhiều tùy chọn khác tại đây.
