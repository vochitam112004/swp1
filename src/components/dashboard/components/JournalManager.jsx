// Journal management component
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import api from "../../../api/axios";

const JournalManager = ({ journal, setJournal }) => {
  const [journalEntry, setJournalEntry] = useState("");
  const [journalDate, setJournalDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [editIdx, setEditIdx] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [shareModal, setShareModal] = useState({ show: false, entry: null });
  const [isSharing, setIsSharing] = useState(false);

  // Lấy nhật ký từ API khi load
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await api.get("/DiaryLog");
        setJournal(res.data);
      } catch {
        setJournal([]);
      }
    };
    fetchJournal();
  }, [setJournal]);

  // Xử lý gửi nhật ký
  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    const existed = journal.find((j) => (j.logDate || j.date) === journalDate);
    if (existed) {
      toast.error(
        "Bạn đã ghi nhật ký cho ngày này. Hãy sửa hoặc xóa để ghi lại."
      );
      return;
    }
    try {
      await api.post("/DiaryLog", {
        logDate: journalDate,
        content: journalEntry,
        createdAt: new Date().toISOString(),
      });
      toast.success("Đã lưu nhật ký!");
      // Sau khi lưu thành công, reload lại nhật ký
      const res = await api.get("/DiaryLog");
      setJournal(res.data);
      setJournalEntry("");
      setJournalDate(new Date().toISOString().slice(0, 10));
    } catch {
      toast.error("Lưu nhật ký thất bại!");
    }
  };

  // Xử lý sửa nhật ký
  const handleEditJournal = (idx) => {
    const entry = journal[idx];
    setJournalEntry(entry.content || "");
    setJournalDate(entry.logDate ? entry.logDate.split('T')[0] : "");
    setEditIdx(idx);
  };

  // Xử lý cập nhật nhật ký
  const handleUpdateJournal = async (e) => {
    e.preventDefault();
    const entry = journal[editIdx];
    try {
      await api.put("/DiaryLog", {
        logId: entry.logId,
        content: journalEntry,
        updateAt: new Date().toISOString(),
      });
      toast.success("Đã cập nhật nhật ký!");
      const res = await api.get("/DiaryLog");
      setJournal(res.data);
      setEditIdx(null);
      setJournalEntry("");
      setJournalDate(new Date().toISOString().slice(0, 10));
    } catch {
      toast.error("Cập nhật nhật ký thất bại!");
    }
  };

  // Xử lý xóa nhật ký
  const handleDeleteJournal = async (idx) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhật ký này?")) return;
    
    const entry = journal[idx];
    try {
      await api.delete(`/DiaryLog/${entry.logId}`);
      toast.success("Đã xóa nhật ký!");
      const res = await api.get("/DiaryLog");
      setJournal(res.data);
    } catch {
      toast.error("Xóa nhật ký thất bại!");
    }
  };

  // Xử lý mở modal chia sẻ
  const handleOpenShareModal = (entry) => {
    setShareModal({ show: true, entry });
  };

  // Xử lý đóng modal chia sẻ
  const handleCloseShareModal = () => {
    setShareModal({ show: false, entry: null });
    setIsSharing(false);
  };

  // Xử lý chia sẻ nhật ký
  const handleShareJournal = async () => {
    try {
      setIsSharing(true);
      // Simulate API call - trong thực tế có thể cần API để đánh dấu public
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Đã chia sẻ nhật ký lên cộng đồng!");
      handleCloseShareModal();
    } catch (error) {
      console.error("Error sharing journal:", error);
      toast.error("Không thể chia sẻ nhật ký");
    } finally {
      setIsSharing(false);
    }
  };

  // Xuất CSV
  const exportCSV = () => {
    if (journal.length === 0) {
      toast.info("Chưa có nhật ký để xuất!");
      return;
    }
    const rows = [
      ["Ngày", "Nội dung"],
      ...journal.map((j) => [
        j.logDate ? j.logDate.split('T')[0] : '',
        (j.content || "").replace(/\n/g, " ")
      ]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "nhat-ky-cai-thuoc.csv");
  };

  // Lọc nhật ký theo tháng
  const filteredJournal = filterMonth
    ? journal.filter((j) => {
        const date = j.logDate ? j.logDate.split('T')[0] : '';
        return date && date.startsWith(filterMonth);
      })
    : journal;

  return (
    <div className="journal-manager">
      {/* Journal Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-pen me-2" />
            {editIdx !== null ? "Sửa nhật ký" : "Thêm nhật ký mới"}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={editIdx !== null ? handleUpdateJournal : handleJournalSubmit}>
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={journalDate}
                  onChange={(e) => setJournalDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-9">
                <label className="form-label">Nội dung nhật ký</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Ghi lại cảm xúc, suy nghĩ, thử thách của bạn hôm nay..."
                  required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <button type="submit" className="btn btn-primary me-2">
                  {editIdx !== null ? "Cập nhật" : "Lưu nhật ký"}
                </button>
                {editIdx !== null && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditIdx(null);
                      setJournalEntry("");
                      setJournalDate(new Date().toISOString().slice(0, 10));
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Journal List */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-book me-2" />
            Danh sách nhật ký ({filteredJournal.length})
          </h5>
          <div className="d-flex gap-2">
            <input
              type="month"
              className="form-control form-control-sm"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ width: "150px" }}
            />
            <button className="btn btn-success btn-sm" onClick={exportCSV}>
              <i className="fas fa-download me-1" />
              Xuất CSV
            </button>
          </div>
        </div>
        <div className="card-body">
          {filteredJournal.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Nội dung</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJournal.map((entry, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{entry.logDate ? entry.logDate.split('T')[0] : ''}</strong>
                      </td>
                      <td>
                        <div style={{ maxWidth: "400px" }}>
                          {(entry.content || "").length > 100
                            ? `${(entry.content).substring(0, 100)}...`
                            : (entry.content || "Không có nội dung")
                          }
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEditJournal(idx)}
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit" />
                          </button>
                          <button
                            className="btn btn-outline-info"
                            onClick={() => handleOpenShareModal(entry)}
                            title="Chia sẻ lên cộng đồng"
                          >
                            <i className="fas fa-share-alt" />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteJournal(idx)}
                            title="Xóa"
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-book-open text-muted" style={{ fontSize: "4rem" }} />
              <h4 className="mt-3 text-muted">Chưa có nhật ký nào</h4>
              <p className="text-muted">
                Hãy bắt đầu ghi nhật ký để theo dõi hành trình cai thuốc của bạn
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {shareModal.show && shareModal.entry && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-share-alt me-2" />
                  Chia sẻ nhật ký
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseShareModal}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2" />
                  Bạn có muốn chia sẻ nhật ký này lên cộng đồng không?
                </div>
                
                <div className="journal-preview p-3 bg-light rounded">
                  <div className="mb-2">
                    <strong>Ngày:</strong> {shareModal.entry.logDate ? 
                      new Date(shareModal.entry.logDate).toLocaleDateString("vi-VN") : 
                      "Không xác định"
                    }
                  </div>
                  <div>
                    <strong>Nội dung:</strong>
                    <p className="mt-1 mb-0" style={{ maxHeight: "100px", overflowY: "auto" }}>
                      {shareModal.entry.content}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="fas fa-shield-alt me-1" />
                    Nhật ký sẽ được hiển thị công khai với tên hiển thị của bạn.
                  </small>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseShareModal}
                  disabled={isSharing}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleShareJournal}
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Đang chia sẻ...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-share-alt me-2" />
                      Chia sẻ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalManager;
