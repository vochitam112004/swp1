import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function SystemReportForm() {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!type || !details.trim()) {
      toast.error("Vui lòng chọn loại báo cáo và nhập nội dung!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/SystemReport", { report_type: type, details });
      toast.success("Đã gửi báo cáo hệ thống!");
      setType("");
      setDetails("");
    } catch {
      toast.error("Gửi báo cáo thất bại!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "0 auto" }}>
      <h3>Gửi báo cáo hệ thống</h3>
      <div className="mb-3">
        <label>Loại báo cáo</label>
        <select className="form-control" value={type} onChange={e => setType(e.target.value)} required>
          <option value="">-- Chọn loại --</option>
          <option value="bug">Lỗi hệ thống</option>
          <option value="feedback">Góp ý</option>
          <option value="abuse">Báo cáo vi phạm</option>
          <option value="other">Khác</option>
        </select>
      </div>
      <div className="mb-3">
        <label>Nội dung</label>
        <textarea className="form-control" rows={4} value={details} onChange={e => setDetails(e.target.value)} required />
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi báo cáo"}
      </button>
    </form>
  );
}