import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function SystemReportManager() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/SystemReport");
      setReports(res.data);
    } catch {
      toast.error("Không thể lấy danh sách báo cáo!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h3>Quản lý báo cáo hệ thống</h3>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người gửi</th>
              <th>Loại</th>
              <th>Thời gian</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.report_id}>
                <td>{r.report_id}</td>
                <td>{r.reporter_id}</td>
                <td>{r.report_type}</td>
                <td>{new Date(r.reported_at).toLocaleString()}</td>
                <td>{r.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-secondary" onClick={fetchReports}>Làm mới</button>
    </div>
  );
}