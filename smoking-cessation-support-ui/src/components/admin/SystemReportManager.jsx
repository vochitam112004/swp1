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
              <th>Người gửi</th>
              <th>Loại</th>
              <th>Thời gian</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.reportId}>
                <td>{r.nameReporter}</td>
                <td>{r.reportType}</td>
                <td>{new Date(r.reportedAt).toLocaleString()}</td>
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