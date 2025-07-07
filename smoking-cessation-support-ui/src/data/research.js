const researchArticles = [
    {
        id: "1",
        title: "Hiệu quả của hỗ trợ kỹ thuật số trong cai thuốc",
        author: "J. Smith et al., 2023",
        content:
            "Các nền tảng kỹ thuật số cung cấp giao diện dễ sử dụng, lời nhắc tự động và theo dõi tiến trình đã được chứng minh là hỗ trợ người dùng bỏ thuốc hiệu quả hơn so với phương pháp truyền thống.\n\n" +
            "🔹 Một thử nghiệm ngẫu nhiên có đối chứng tại California cho thấy tỷ lệ bỏ thuốc ở nhóm sử dụng ứng dụng hỗ trợ là 48% sau 12 tuần, so với 26% ở nhóm sử dụng tư vấn qua điện thoại.\n" +
            "🔹 Nghiên cứu trên tạp chí *Nicotine & Tobacco Research* (2023) chỉ ra rằng ứng dụng có tính năng nhắc nhở và ghi nhật ký giúp duy trì động lực tốt hơn 39%.\n" +
            "🔹 Tính năng thống kê tiền tiết kiệm và sức khỏe cải thiện tạo ra cảm giác 'nhìn thấy kết quả', từ đó khuyến khích người dùng tiếp tục hành trình bỏ thuốc.\n\n" +
            "Sự hỗ trợ kỹ thuật số giúp hành trình bỏ thuốc trở nên chủ động, thuận tiện và mang tính cá nhân hóa cao.",
    },
    {
        id: "2",
        title: "Tâm lý học hành vi trong hỗ trợ cai thuốc",
        author: "Nguyễn Văn Dũng, 2022",
        content:
            "Việc áp dụng trị liệu hành vi nhận thức (CBT) trong ứng dụng cai thuốc giúp người dùng điều chỉnh suy nghĩ và hành vi, từ đó kiểm soát tốt hơn các yếu tố kích thích cơn thèm thuốc.\n\n" +
            "🔹 Nghiên cứu tại Đại học Y Dược TP.HCM chỉ ra rằng người dùng được hỗ trợ CBT qua ứng dụng có tỷ lệ cai thành công cao hơn gấp 1.7 lần so với nhóm chỉ dùng mẹo dân gian.\n" +
            "🔹 Kỹ thuật “thay thế suy nghĩ tiêu cực” và “quản lý kích thích” được tích hợp trong ứng dụng giúp giảm căng thẳng và giảm nguy cơ tái nghiện.\n" +
            "🔹 Theo *American Psychological Association*, CBT là “tiêu chuẩn vàng” trong các phương pháp hỗ trợ thay đổi hành vi như cai thuốc.\n\n" +
            "CBT là một trụ cột không thể thiếu khi kết hợp yếu tố tâm lý với công nghệ số trong hành trình bỏ thuốc lá.",
    },
    {
        id: "3",
        title: "So sánh giữa cai thuốc truyền thống và nền tảng số",
        author: "Lisa M. Chan, 2021",
        content:
            "Công nghệ hỗ trợ bỏ thuốc có tính tương tác cao, giúp người dùng chủ động hơn, từ đó cải thiện đáng kể hiệu quả so với phương pháp truyền thống.\n\n" +
            "🔹 Trong khảo sát 500 người tại Mỹ, tỷ lệ bỏ thuốc thành công sau 3 tháng là 56% ở nhóm sử dụng ứng dụng, so với 31% ở nhóm dùng phương pháp truyền thống như hỗ trợ qua điện thoại.\n" +
            "🔹 Các ứng dụng tích hợp nhiều công cụ như đánh giá tiến trình, hỗ trợ cộng đồng, đặt mục tiêu và báo cáo động lực.\n" +
            "🔹 Người dùng phản hồi rằng họ cảm thấy “được đồng hành mỗi ngày” thông qua hệ thống thông báo, huy hiệu và nội dung tư vấn đa dạng.\n\n" +
            "Nền tảng số không thay thế hoàn toàn phương pháp truyền thống, nhưng là công cụ tăng cường hiệu quả mạnh mẽ trong thời đại số hóa.",
    },
    {
        id: "4",
        title: "Tác động của phần thưởng và gamification trong việc bỏ thuốc",
        author: "Tổng hợp nghiên cứu 2020–2024",
        content:
            "Ứng dụng các yếu tố trò chơi hóa (gamification) như huy hiệu, điểm thưởng, bảng xếp hạng đã được chứng minh là tăng cường cam kết bỏ thuốc và duy trì động lực cho người dùng.\n\n" +
            "🔹 Một nghiên cứu từ Đại học Pennsylvania (2020) cho thấy tỷ lệ bỏ thuốc cao hơn 45% khi người tham gia nhận được phần thưởng tài chính hoặc huy hiệu ảo trong ứng dụng cai thuốc (Halpern et al., 2020).\n" +
            "🔹 Trong chương trình SmokeFree28 tại Vương quốc Anh, người dùng được khuyến khích ghi nhật ký và đạt huy hiệu mỗi ngày đã duy trì thói quen không hút thuốc lâu hơn 60% so với nhóm đối chứng.\n" +
            "🔹 Nghiên cứu đăng trên *JMIR mHealth and uHealth (2022)* khẳng định rằng gamification không chỉ thúc đẩy hành vi tích cực, mà còn giảm tỷ lệ tái nghiện nhờ cảm giác thành tựu và sự hỗ trợ từ cộng đồng trực tuyến.\n\n" +
            "Việc tích hợp trò chơi hóa trong các nền tảng số như Breathe Free là một xu hướng được đánh giá cao về hiệu quả và mức độ tương tác, đặc biệt ở nhóm người dùng trẻ tuổi hoặc mới bắt đầu hành trình bỏ thuốc.",
    },
];

export default researchArticles;
