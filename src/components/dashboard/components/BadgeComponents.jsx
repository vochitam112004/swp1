// Badge management component
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from '../../../api/axios';
import { getAchievedBadges, sendBrowserNotification } from "../utils/dashboardUtils";

const BadgeComponents = ({ userId, progress, achievedBadges, setAchievedBadges }) => {
  const [badgeTemplates, setBadgeTemplates] = useState([]);
  const [encourages, setEncourages] = useState(() => {
    const saved = localStorage.getItem("encourages");
    return saved ? JSON.parse(saved) : {};
  });
  const [commentInputs, setCommentInputs] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);

  // 🔄 Fetch badge templates from API & đồng bộ thành tích
  useEffect(() => {
    if (!userId) return;
    const syncAchievements = async () => {
      try {
        await api.post("/UserAchievement/assign-by-money");
        const res = await api.get(`/UserAchievement/${userId}`);
        const badges = Array.isArray(res.data)
          ? res.data.map(a => ({
            key: a.template?.templateId || a.templateId,
            label: a.template?.name || "",
            icon: "fas fa-award",
            description: a.template?.description || "",
          }))
          : [];
        setAchievedBadges(badges);
      } catch (error) {
        console.warn("Không thể đồng bộ thành tích từ server:", error);
      }
    };
    syncAchievements();
    // eslint-disable-next-line
  }, [userId, progress, setAchievedBadges]);

  // 🏅 Xác định huy hiệu đã đạt (nếu dùng badgeTemplates)
  useEffect(() => {
    if (!progress || badgeTemplates.length === 0) return;

    const achieved = getAchievedBadges(progress, badgeTemplates);
    const stored = JSON.parse(localStorage.getItem("allBadges") || "[]");

    const newBadges = [];

    achieved.forEach((badge) => {
      if (!stored.some((b) => b.key === badge.key)) {
        stored.push(badge);
        newBadges.push(badge);
      }
    });

    localStorage.setItem("allBadges", JSON.stringify(stored));

    const shown = JSON.parse(localStorage.getItem("shownBadges") || "[]");

    newBadges.forEach((badge) => {
      if (!shown.includes(badge.key)) {
        toast.success(`🎉 Chúc mừng! Bạn vừa đạt huy hiệu: ${badge.label}`);
        sendBrowserNotification("🎉 Chúc mừng!", `Bạn vừa đạt huy hiệu: ${badge.label}`);
        shown.push(badge.key);
      }
    });

    localStorage.setItem("shownBadges", JSON.stringify(shown));

    setAchievedBadges(stored);
  }, [progress, badgeTemplates, setAchievedBadges]);

  // --- Các hàm xử lý ---
  const shareBadge = (badge) => {
    localStorage.setItem("sharedBadgeToCommunity", JSON.stringify({
      badge,
      sharedAt: new Date().toISOString()
    }));
    window.location.href = "/community";
  };

  const handleEncourage = (idx) => {
    const encouragesObj = JSON.parse(localStorage.getItem("encourages") || "{}");
    encouragesObj[idx] = (encouragesObj[idx] || 0) + 1;
    localStorage.setItem("encourages", JSON.stringify(encouragesObj));
    setEncourages(encouragesObj);
    toast.success("Bạn đã động viên thành công!");
    setForceUpdate((f) => f + 1);
  };

  const handleAddComment = (idx, comment) => {
    const commentsObj = JSON.parse(localStorage.getItem("badgeComments") || "{}");
    if (!commentsObj[idx]) commentsObj[idx] = [];
    commentsObj[idx].push({ text: comment, time: new Date().toLocaleString() });
    localStorage.setItem("badgeComments", JSON.stringify(commentsObj));
    setForceUpdate((f) => f + 1);
  };

  const handleCommentSubmit = (idx) => {
    const comment = commentInputs[idx];
    if (!comment || comment.trim() === "") {
      toast.error("Vui lòng nhập bình luận!");
      return;
    }
    handleAddComment(idx, comment.trim());
    setCommentInputs({ ...commentInputs, [idx]: "" });
    toast.success("Đã thêm bình luận!");
  };

  const getBadgeComments = (idx) => {
    const comments = JSON.parse(localStorage.getItem("badgeComments") || "{}");
    return comments[idx] || [];
  };

  // --- Render danh sách badge ---
  const renderBadgeList = () => {
    return (
      <div className="row">
        {achievedBadges.map((badge, idx) => (
          <div key={badge.key} className="col-md-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <i className={`${badge.icon || "fas fa-award"} text-warning me-3`} style={{ fontSize: "2rem" }} />
                  <div>
                    <h5 className="card-title mb-1">{badge.label}</h5>
                    <small className="text-muted">Đã đạt được</small>
                  </div>
                </div>

                <div className="d-flex gap-2 mb-3">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => shareBadge(badge)}
                  >
                    <i className="fas fa-share me-1" />
                    Chia sẻ
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleEncourage(idx)}
                  >
                    <i className="fas fa-thumbs-up me-1" />
                    Động viên ({encourages[idx] || 0})
                  </button>
                </div>

                <div className="border-top pt-3">
                  <div className="input-group input-group-sm mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Viết bình luận..."
                      value={commentInputs[idx] || ""}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [idx]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCommentSubmit(idx);
                        }
                      }}
                    />
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleCommentSubmit(idx)}
                    >
                      Gửi
                    </button>
                  </div>

                  {getBadgeComments(idx).length > 0 && (
                    <div className="badge-comments mt-2">
                      <small className="text-muted fw-bold">Bình luận:</small>
                      <div className="mt-1" style={{ maxHeight: "100px", overflowY: "auto" }}>
                        {getBadgeComments(idx).map((comment, commentIdx) => (
                          <div key={commentIdx} className="small mb-1">
                            <span className="fw-bold text-primary">Bạn:</span>{" "}
                            <span>{comment.text}</span>
                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                              {comment.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {achievedBadges.length === 0 && (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="fas fa-medal text-muted" style={{ fontSize: "4rem" }} />
              <h4 className="mt-3 text-muted">Chưa có huy hiệu nào</h4>
              <p className="text-muted">
                Hãy tiếp tục cố gắng để nhận được huy hiệu đầu tiên!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Return UI ---
  return (
    <div className="badge-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-trophy text-warning me-2" />
          Huy hiệu thành tích ({achievedBadges.length}/{badgeTemplates.length})
        </h3>
      </div>
      {renderBadgeList()}
    </div>
  );
};

export default BadgeComponents;