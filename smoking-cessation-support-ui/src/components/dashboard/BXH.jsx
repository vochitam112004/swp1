import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../css/BXH.css";

export default function BXH() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách xếp hạng (ví dụ: /leaderboard)
    api.get("leaderboard")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="bxh-container">
      <h2>Bảng Xếp Hạng</h2>
      <table className="bxh-table">
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Tên</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={3}>Chưa có dữ liệu xếp hạng.</td>
            </tr>
          )}
          {users.map((user, idx) => (
            <tr key={user.id || idx}>
              <td>{idx + 1}</td>
              <td>{user.fullName || user.username}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );//
}