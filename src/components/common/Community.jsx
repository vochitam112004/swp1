import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../../css/Community.css";

const Community = () => {
    const [communityJournals, setCommunityJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest"); // newest, oldest
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sharedBadge, setSharedBadge] = useState(null);

    useEffect(() => {
        const shared = localStorage.getItem("sharedBadgeToCommunity");
        if (shared) {
            const { badge } = JSON.parse(shared);
            setSharedBadge(badge); // Lưu vào state để render
            toast.success(`🎉 Bạn vừa chia sẻ thành tích: ${badge.label} lên cộng đồng!`);
            localStorage.removeItem("sharedBadgeToCommunity");
        }
    }, []);

    // Lấy tất cả nhật ký công khai từ API
    useEffect(() => {
        const fetchCommunityJournals = async () => {
            try {
                setLoading(true);
                const response = await api.get("/DiaryLog");

                // Format dữ liệu cho cộng đồng
                const formattedJournals = response.data.map(journal => ({
                    logId: journal.logId,
                    userId: journal.userId,
                    logDate: journal.logDate,
                    content: journal.content,
                    createdAt: journal.createdAt,
                    updatedAt: journal.updatedAt,
                    user: {
                        displayName: journal.user?.displayName || journal.user?.username || "Người dùng ẩn danh",
                        avatarUrl: journal.user?.avatarUrl,
                        userType: journal.user?.userType,
                        userId: journal.user?.userId
                    }
                }));

                setCommunityJournals(formattedJournals);
            } catch (error) {
                console.error("Lỗi khi tải nhật ký cộng đồng:", error);
                toast.error("Không thể tải nhật ký cộng đồng");
            } finally {
                setLoading(false);
            }
        };

        fetchCommunityJournals();
    }, []);

    // Lọc và sắp xếp nhật ký
    const filteredAndSortedJournals = communityJournals
        .filter(journal =>
            journal.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (journal.user?.displayName || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.logDate || a.createdAt);
            const dateB = new Date(b.logDate || b.createdAt);
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

    // Hiển thị chi tiết nhật ký
    const handleViewDetail = (journal) => {
        setSelectedJournal(journal);
        setShowModal(true);
    };

    // Mảng các câu động viên ngẫu nhiên
    const motivationalQuotes = [
        "💪 Mỗi lần viết nhật ký, mình cảm thấy như vừa đặt thêm một viên gạch vững chắc trên con đường từ bỏ thuốc lá.",
        "🌟 Mình biết đây là hành trình không dễ dàng, nhưng mỗi ngày kiên trì là mình lại thấy mạnh mẽ hơn – và hy vọng câu chuyện của mình cũng tiếp thêm động lực cho ai đó ngoài kia.",
        "🎯 Việc chia sẻ không chỉ giúp mình giải tỏa, mà còn nhắc mình rằng mình không đơn độc. Cộng đồng ở đây thật sự quan trọng.",
        "🔥 Có những lúc mình muốn bỏ cuộc, nhưng nhìn lại những gì đã vượt qua, mình thấy mình làm rất tốt. Và mình sẽ tiếp tục cố gắng.",
        "🌈 Một ngày không thuốc lá – nghe có vẻ nhỏ thôi, nhưng thật sự là một chiến thắng khiến mình tự hào.",
        "💎 Mình cảm nhận được cơ thể đang thay đổi tích cực – ngủ ngon hơn, thở dễ hơn. Thật tuyệt!",
        "🚀 Mỗi lần vượt qua cơn thèm thuốc, mình lại thấy mình đang dần trở thành phiên bản tốt hơn – khỏe mạnh và làm chủ chính mình.",
        "🏆 Cảm ơn cộng đồng đã luôn lắng nghe và ủng hộ. Sự đồng hành của mọi người là động lực to lớn để mình không bỏ cuộc."
    ];

    // Lấy câu động viên ngẫu nhiên
    const getRandomMotivation = () => {
        return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    };

    // Format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return "Không xác định";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Rút gọn nội dung
    const truncateContent = (content, maxLength = 150) => {
        if (!content) return "";
        return content.length > maxLength
            ? content.substring(0, maxLength) + "..."
            : content;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="community-page">
            <div className="container-fluid px-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="mb-1">
                                    <i className="fas fa-users me-2 text-primary"></i>
                                    Cộng đồng chia sẻ
                                </h2>
                                <p className="text-muted">Chia sẻ và khám phá hành trình cai thuốc của mọi người</p>
                            </div>
                            <div className="badge bg-primary fs-6">
                                {filteredAndSortedJournals.length} nhật ký
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm theo nội dung hoặc tên người dùng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                        </select>
                    </div>
                </div>

                {sharedBadge && (
                    <div className="alert alert-info d-flex align-items-center mb-4 shadow-sm">
                        <i className="fas fa-award text-warning me-3" style={{ fontSize: "2rem" }} />
                        <div>
                            <strong>Thành tích vừa chia sẻ:</strong>
                            <div className="fw-bold">{sharedBadge.label}</div>
                            <div className="small text-muted">{sharedBadge.description}</div>
                        </div>
                    </div>
                )}

                {/* Journal List */}
                <div className="row">
                    {filteredAndSortedJournals.length > 0 ? (
                        filteredAndSortedJournals.map((journal) => (
                            <div key={journal.logId} className="col-lg-6 col-xl-4 mb-4">
                                <div className="card h-100 shadow-sm hover-shadow">
                                    <div className="card-header bg-transparent border-0 pb-0">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-container me-3">
                                                {journal.user.avatarUrl ? (
                                                    <img
                                                        src={journal.user.avatarUrl}
                                                        alt="Avatar"
                                                        className="rounded-circle"
                                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                                                        style={{ width: "40px", height: "40px" }}
                                                    >
                                                        {journal.user.displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0">{journal.user.displayName}</h6>
                                                <small className="text-muted">
                                                    {formatDate(journal.logDate || journal.createdAt)}
                                                </small>
                                            </div>
                                            {journal.user.userType === "Coach" && (
                                                <span className="badge bg-success">Coach</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-body pt-2">
                                        <p className="card-text">
                                            {truncateContent(journal.content)}
                                        </p>
                                    </div>

                                    <div className="card-footer bg-transparent border-0 pt-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                <i className="far fa-calendar me-1"></i>
                                                {journal.logDate ? new Date(journal.logDate).toLocaleDateString("vi-VN") : ""}
                                            </small>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleViewDetail(journal)}
                                            >
                                                <i className="fas fa-eye me-1"></i>
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="text-center py-5">
                                <i className="fas fa-users text-muted" style={{ fontSize: "4rem" }}></i>
                                <h4 className="mt-3 text-muted">Chưa có nhật ký nào</h4>
                                <p className="text-muted">
                                    {searchTerm
                                        ? "Không tìm thấy nhật ký nào phù hợp với từ khóa tìm kiếm"
                                        : "Hãy là người đầu tiên chia sẻ nhật ký của bạn với cộng đồng"
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal chi tiết */}
            {showModal && selectedJournal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-gradient-primary text-white">
                                <div className="d-flex align-items-center w-100">
                                    <div className="avatar-container me-3">
                                        {selectedJournal.user.avatarUrl ? (
                                            <img
                                                src={selectedJournal.user.avatarUrl}
                                                alt="Avatar"
                                                className="rounded-circle border border-white"
                                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary border border-white"
                                                style={{ width: "50px", height: "50px", fontSize: "1.5rem", fontWeight: "bold" }}
                                            >
                                                {selectedJournal.user.displayName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="modal-title mb-1 text-white">
                                            <i className="fas fa-book-open me-2" />
                                            Nhật ký của {selectedJournal.user.displayName}
                                        </h5>
                                        <small className="text-white-50">
                                            <i className="far fa-clock me-1" />
                                            {formatDate(selectedJournal.logDate || selectedJournal.createdAt)}
                                        </small>
                                    </div>
                                    {selectedJournal.user.userType === "Coach" && (
                                        <span className="badge bg-warning text-dark ms-2">
                                            <i className="fas fa-star me-1" />
                                            Coach
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body p-4">
                                {/* Câu động viên */}
                                <div className="alert alert-success border-0 shadow-sm mb-4">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-heart text-danger me-2" style={{ fontSize: "1.2rem" }}></i>
                                        <span className="fw-medium">{getRandomMotivation()}</span>
                                    </div>
                                </div>

                                {/* Nội dung nhật ký */}
                                <div className="journal-content-wrapper">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="fas fa-feather-alt text-primary me-2"></i>
                                        <h6 className="mb-0 text-muted">Nội dung chia sẻ</h6>
                                    </div>

                                    <div className="journal-content bg-light p-4 rounded-3 shadow-sm">
                                        <p className="mb-0" style={{
                                            whiteSpace: "pre-wrap",
                                            lineHeight: "1.8",
                                            fontSize: "1.05rem",
                                            color: "#2c3e50"
                                        }}>
                                            {selectedJournal.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Thông tin bổ sung */}
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <div className="info-card p-3 bg-primary bg-gradient rounded-3 text-white">
                                            <div className="d-flex align-items-center">
                                                <i className="far fa-calendar-alt me-2" style={{ fontSize: "1.5rem" }}></i>
                                                <div>
                                                    <small className="d-block opacity-75">Ngày nhật ký</small>
                                                    <strong>
                                                        {selectedJournal.logDate ?
                                                            new Date(selectedJournal.logDate).toLocaleDateString("vi-VN", {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            }) :
                                                            "Không xác định"
                                                        }
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-card p-3 bg-success bg-gradient rounded-3 text-white">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-user-circle me-2" style={{ fontSize: "1.5rem" }}></i>
                                                <div>
                                                    <small className="d-block opacity-75">Chia sẻ bởi</small>
                                                    <strong>{selectedJournal.user.displayName}</strong>
                                                    {selectedJournal.user.userType === "Coach" && (
                                                        <small className="d-block">
                                                            <i className="fas fa-graduation-cap me-1"></i>
                                                            Huấn luyện viên
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lời khuyến khích cuối */}
                                <div className="text-center mt-4 p-3 bg-light rounded-3">
                                    <p className="mb-2 text-muted fst-italic">
                                        <i className="fas fa-quote-left me-2"></i>
                                        "Mỗi câu chuyện được chia sẻ là ánh sáng dẫn đường cho người khác"
                                        <i className="fas fa-quote-right ms-2"></i>
                                    </p>
                                    <small className="text-muted">💝 Cảm ơn bạn đã chia sẻ với cộng đồng</small>
                                </div>
                            </div>

                            <div className="modal-footer bg-light border-0">
                                <div className="d-flex justify-content-between w-100 align-items-center">
                                    <div className="d-flex align-items-center text-muted">
                                        <i className="fas fa-users me-2"></i>
                                        <small>Cộng đồng Breathe Free</small>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary px-4"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <i className="fas fa-check me-2"></i>
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
