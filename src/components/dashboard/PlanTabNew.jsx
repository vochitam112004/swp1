import React, { useEffect, useState } from "react";
import { ApiHelper } from "../../utils/apiHelper";
import DateUtils from "../../utils/dateUtils";
import { toast } from "react-toastify";

export default function PlanTabNew() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedWeeks, setGeneratedWeeks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [formData, setFormData] = useState({
    startDate: DateUtils.toISODateString(new Date()),
    endDate: DateUtils.toISODateString(DateUtils.addWeeks(new Date(), 1)),
  });

  const [editFormData, setEditFormData] = useState({
    targetQuitDate: "",
    isCurrentGoal: true,
  });

  const fetchSchedule = async () => {
    const data = await ApiHelper.fetchGeneratedWeeklySchedule();
    console.log("📅 Weekly schedule:", data); // Debug log
    setGeneratedWeeks(data);
  };

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      const goalPlan = await ApiHelper.fetchGoalPlan();
      if (goalPlan) {
        setPlan(goalPlan);
        setEditFormData({
          targetQuitDate: DateUtils.toISODateString(goalPlan.endDate),
          isCurrentGoal: goalPlan.isCurrentGoal !== undefined ? goalPlan.isCurrentGoal : true,
        });
        await fetchSchedule();
      } else {
        setPlan(null);
        setGeneratedWeeks([]);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      toast.error("Không thể tải kế hoạch hiện tại");
    } finally {
      setLoading(false);
    }
  };

  const createNewPlan = async () => {
    if (!formData.startDate || !formData.endDate) {
      toast.warn("Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc");
      return;
    }

    try {
      await ApiHelper.createGoalPlan({
        ...formData,
        targetQuitDate: formData.endDate
      });
      toast.success("Tạo kế hoạch thành công");
      setShowCreateForm(false);
      await fetchCurrentPlan(); // Gọi lại để lấy kế hoạch + lịch mới
    } catch (error) {
      console.error("Create plan error:", error);
      toast.error("Tạo kế hoạch thất bại");
    }
  };

  const deletePlan = async () => {
    if (!plan?.planId) {
      toast.warn("Không xác định được kế hoạch để xóa");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa kế hoạch này?")) return;

    try {
      await ApiHelper.deleteGoalPlan(plan.planId);
      toast.success("Xóa kế hoạch thành công");
      setPlan(null);
      setGeneratedWeeks([]); // clear lịch
    } catch (error) {
      toast.error("Xóa kế hoạch thất bại");
    }
  };

  const updateExistingPlan = async () => {
    if (!editFormData.targetQuitDate) {
      toast.warn("Vui lòng chọn ngày kết thúc");
      return;
    }

    try {
      await ApiHelper.updateGoalPlan({
        ...plan,
        targetQuitDate: editFormData.targetQuitDate,
        isCurrentGoal: editFormData.isCurrentGoal,
      });
      toast.success("Cập nhật kế hoạch thành công");
      setShowEditForm(false);
      await fetchCurrentPlan();
    } catch (error) {
      console.error("Update plan error:", error);
      toast.error("Cập nhật kế hoạch thất bại");
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  return (
    <div className="plan-tab-container">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          {!plan && !showCreateForm && (
            <div className="no-plan-state">
              <h3>Chưa có kế hoạch</h3>
              <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                Tạo kế hoạch mới
              </button>
            </div>
          )}

          {showCreateForm && (
            <div className="create-plan-form">
              <h3>Tạo kế hoạch</h3>
              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-control"
              />
              <label>Ngày kết thúc:</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="form-control"
              />
              <button className="btn btn-success mt-2" onClick={createNewPlan}>
                Lưu kế hoạch
              </button>
              <button className="btn btn-secondary mt-2" onClick={() => setShowCreateForm(false)}>
                Hủy
              </button>
            </div>
          )}

          {showEditForm && plan && (
            <div className="edit-plan-form">
              <h3>Chỉnh sửa kế hoạch</h3>
              <label>Ngày kết thúc:</label>
              <input
                type="date"
                value={editFormData.targetQuitDate}
                onChange={(e) => setEditFormData(prev => ({ ...prev, targetQuitDate: e.target.value }))}
                className="form-control"
              />
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="completePlanCheckbox"
                  checked={!editFormData.isCurrentGoal}
                  onChange={e => setEditFormData(prev => ({
                    ...prev,
                    isCurrentGoal: !e.target.checked // Nếu tích thì chuyển thành false
                  }))}
                />
                <label className="form-check-label" htmlFor="completePlanCheckbox">
                  Đánh dấu là đã hoàn thành kế hoạch này
                </label>
              </div>
              <button className="btn btn-primary mt-2" onClick={updateExistingPlan}>
                Cập nhật kế hoạch
              </button>
              <button style={{marginLeft: "4px"}} className="btn btn-secondary mt-2" onClick={() => setShowEditForm(false)}>
                Hủy
              </button>
            </div>
          )}

          {plan && !showEditForm && !showCreateForm && (
            <div className="existing-plan">
              <h3>Kế hoạch hiện tại</h3>
              <p><strong>Ngày bắt đầu:</strong> {plan.startDate ? DateUtils.toVietnameseString(plan.startDate) : "Không rõ"}</p>
              <p><strong>Ngày kết thúc:</strong> {plan.endDate ? DateUtils.toVietnameseString(plan.endDate) : "Không rõ"}</p>
              <p><strong>Thời gian:</strong> {plan.totalDays || DateUtils.daysDifference(plan.endDate, plan.startDate)} ngày</p>
              <button className="btn btn-warning" onClick={() => setShowEditForm(true)}>
                Chỉnh sửa
              </button>
              <button className="btn btn-danger ms-2" onClick={deletePlan}>
                Xóa kế hoạch
              </button>
            </div>
          )}

          {plan && generatedWeeks.length > 0 && (
            <div className="weekly-schedule mt-4">
              <h4>Lịch giảm hàng tuần</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Tuần</th>
                    <th>Ngày bắt đầu của tuần</th>
                    <th>Ngày kết thúc của tuần</th>
                    <th>Số điếu giảm</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedWeeks.map((week, index) => (
                    <tr key={index}>
                      <td>Tuần {week.weekNumber}</td>
                      <td>{DateUtils.toVietnameseString(week.startDate)}</td>
                      <td>{DateUtils.toVietnameseString(week.endDate)}</td>
                      <td>{week.cigarettesReduced}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
