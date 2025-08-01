import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import '../../css/Dashboard.css';
import '../../css/PlanTabNew.css';

const PlanTabNew = () => {
  const [plan, setPlan] = useState(null);
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [personalGoals, setPersonalGoals] = useState([
    "Cả ngày không hút thuốc",
    "Tăng kiểm soát thói quen",
    "Lâm gương cốt cho con cái",
    "Tăng cường thể lực"
  ]);
  
  const [rewardSystem, setRewardSystem] = useState([
    { period: "1 tuần", description: "Mua một bản sách yêu thích" },
    { period: "1 tháng", description: "Đi xem phim cùng gia đình" },
    { period: "3 tháng", description: "Mua một món đồ mong muốn" },
    { period: "6 tháng", description: "Đi du lịch ngắn hạn" }
  ]);

  // Form data for creating new plan
  const [formData, setFormData] = useState({
    totalWeeks: 4,
    startDate: new Date().toISOString().split('T')[0],
    weeklyReductions: [],
    personalMotivation: ''
  });

  // Form data for editing existing plan
  const [editFormData, setEditFormData] = useState({
    personalMotivation: '',
    targetQuitDate: '',
    weeklyReductions: []
  });

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      const response = await api.get('/GoalPlan/current-goal');
      if (response.data) {
        setPlan(response.data);
        // If plan exists, fetch weekly reduction plans and populate edit form
        fetchWeeklyPlans(response.data.id);
        populateEditForm(response.data);
      }
    } catch (error) {
      console.error('Error fetching current plan:', error);
      if (error.response?.status !== 404) {
        toast.error('Không thể tải kế hoạch hiện tại');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyPlans = async (planId) => {
    try {
      const response = await api.get(`/GoalPlanWeeklyReduction/plan/${planId}`);
      setWeeklyPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching weekly plans:', error);
    }
  };

  const populateEditForm = (planData) => {
    setEditFormData({
      personalMotivation: planData.personalMotivation || planData.PersonalMotivation || '',
      targetQuitDate: (planData.targetQuitDate || planData.TargetQuitDate)?.split('T')[0] || '',
      weeklyReductions: []
    });
  };

  // Initialize edit form with weekly plans when they are loaded
  useEffect(() => {
    if (weeklyPlans.length > 0 && plan) {
      const weeklyReductions = weeklyPlans.map(week => ({
        reduction: week.targetReduction
      }));
      setEditFormData(prev => ({
        ...prev,
        weeklyReductions
      }));
    }
  }, [weeklyPlans, plan]);

  const handleEditPlan = () => {
    setShowEditForm(true);
    setShowCreateForm(false);
    if (plan) {
      populateEditForm(plan);
    }
  };

  const updateExistingPlan = async () => {
    try {
      // Update main plan
      const planData = {
        personalMotivation: editFormData.personalMotivation,
        targetQuitDate: editFormData.targetQuitDate,
        isCurrentGoal: true
      };

      await api.put(`/GoalPlan/${plan.id}`, planData);

      // Update weekly reduction plans if any changes
      if (editFormData.weeklyReductions.length > 0) {
        const updatePromises = editFormData.weeklyReductions.map((week, index) => {
          const existingWeek = weeklyPlans[index];
          if (existingWeek) {
            return api.put(`/GoalPlanWeeklyReduction/${existingWeek.id}`, {
              ...existingWeek,
              targetReduction: week.reduction
            });
          }
        });
        
        await Promise.all(updatePromises.filter(Boolean));
      }
      
      toast.success('Cập nhật kế hoạch thành công!');
      setShowEditForm(false);
      await fetchCurrentPlan();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Cập nhật kế hoạch thất bại!');
    }
  };

  const createNewPlan = async () => {
    try {
      // First create the main plan
      const planData = {
        startDate: formData.startDate,
        targetQuitDate: calculateEndDate(formData.startDate, formData.totalWeeks),
        personalMotivation: formData.personalMotivation || "Vì sức khỏe và tương lai tốt đẹp",
        isCurrentGoal: true
      };

      const planResponse = await api.post('/GoalPlan', planData);
      const createdPlan = planResponse.data;

      // Then create weekly reduction plans
      const weeklyPlansPromises = formData.weeklyReductions.map((week, index) => {
        const weekStart = new Date(formData.startDate);
        weekStart.setDate(weekStart.getDate() + (index * 7));
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        return api.post('/GoalPlanWeeklyReduction', {
          goalPlanId: createdPlan.id,
          weekNumber: index + 1,
          targetReduction: week.reduction,
          weekStartDate: weekStart.toISOString().split('T')[0],
          weekEndDate: weekEnd.toISOString().split('T')[0]
        });
      });

      await Promise.all(weeklyPlansPromises);
      
      toast.success('Tạo kế hoạch thành công!');
      setShowCreateForm(false);
      await fetchCurrentPlan();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Tạo kế hoạch thất bại!');
    }
  };

  const calculateEndDate = (startDate, weeks) => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + (weeks * 7));
    return end.toISOString().split('T')[0];
  };

  const handleWeeklyReductionChange = (weekIndex, value) => {
    const newReductions = [...formData.weeklyReductions];
    newReductions[weekIndex] = { ...newReductions[weekIndex], reduction: parseInt(value) || 0 };
    setFormData(prev => ({ ...prev, weeklyReductions: newReductions }));
  };

  const handleEditWeeklyReductionChange = (weekIndex, value) => {
    const newReductions = [...editFormData.weeklyReductions];
    if (!newReductions[weekIndex]) {
      newReductions[weekIndex] = {};
    }
    newReductions[weekIndex] = { ...newReductions[weekIndex], reduction: parseInt(value) || 0 };
    setEditFormData(prev => ({ ...prev, weeklyReductions: newReductions }));
  };

  const initializeWeeklyReductions = (weeks) => {
    const reductions = [];
    for (let i = 0; i < weeks; i++) {
      reductions.push({ reduction: Math.max(1, 10 - (i * 2)) }); // Giảm dần từ 10 về 1
    }
    setFormData(prev => ({ ...prev, weeklyReductions: reductions }));
  };

  useEffect(() => {
    if (formData.totalWeeks > 0) {
      initializeWeeklyReductions(formData.totalWeeks);
    }
  }, [formData.totalWeeks]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-tab-container">
      {!plan && !showCreateForm && (
        <div className="no-plan-state">
          <div className="success-banner">
            <div className="success-content">
              <div className="checkmark">✓</div>
              <div>
                <h3>Kế hoạch cai thuốc của bạn đã sẵn sáng!</h3>
                <p>Kế hoạch được thiết kế đặc biệt dựa trên thông tin và mục tiêu của bạn</p>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon green">✓</div>
              <div className="stat-info">
                <h4>Ngày bắt đầu</h4>
                <p>1/8/2025</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon blue">📊</div>
              <div className="stat-info">
                <h4>Mục tiêu hoàn thành</h4>
                <p>26/9/2025</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon purple">⏰</div>
              <div className="stat-info">
                <h4>Thới gian dự kiến</h4>
                <p>56 ngày</p>
              </div>
            </div>
          </div>

          <div className="content-sections">
            <div className="left-section">
              <div className="goals-section">
                <h3>Các mục tiêu quan trọng</h3>
                <div className="goals-list">
                  {personalGoals.map((goal, index) => (
                    <div key={index} className="goal-item">
                      <span className="goal-number">{index + 1}</span>
                      <div className="goal-content">
                        <span>Tuần {index + 1}</span>
                        <p>Giảm xuống {13 - (index * 3)} điếu/ngày</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${13 + (index * 10)}%`}}></div>
                        </div>
                        <span className="progress-text">{13 + (index * 10)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="right-section">
              <div className="goals-section">
                <h3>Mục tiêu cá nhân</h3>
                <div className="personal-goals">
                  <ul>
                    <li>Cả ngày không hút thuốc và hỗ trợ</li>
                    <li>Tăng kiểm soát thói quen cho gia đình</li>
                    <li>Làm gương tốt cho con cái</li>
                    <li>Tăng cường thể lực</li>
                  </ul>
                </div>
              </div>

              <div className="reward-section">
                <h3>Hệ thống phần thưởng</h3>
                <div className="rewards-list">
                  {rewardSystem.map((reward, index) => (
                    <div key={index} className="reward-item">
                      <div className="reward-badge">{index + 1}</div>
                      <div className="reward-info">
                        <span className="reward-period">{reward.period}</span>
                        <p>{reward.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="action-section">
            <div className="emergency-alert">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <h4>Kế hoạch khẩn cấp</h4>
                <p>Khi cảm thấy khó khăn hoặc cơn thèm thuốc - tốt hỗ trợ dài hạn và những lời khuyên. Tập thể dục hoặc gọi điện cho người thân. Tạo ra cách làm cho có thể bình tĩnh</p>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-create-plan"
                onClick={() => setShowCreateForm(true)}
              >
                Bắt đầu tạo kế hoạch
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Tùy chỉnh kế hoạch
              </button>
              <button className="btn btn-outline-secondary">
                Tải xuống PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="create-plan-form">
          <div className="form-header">
            <h3>Tạo kế hoạch cai thuốc mới</h3>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setShowCreateForm(false)}
            >
              Quay lại
            </button>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label>Động lực cá nhân:</label>
              <textarea
                value={formData.personalMotivation}
                onChange={(e) => setFormData(prev => ({ ...prev, personalMotivation: e.target.value }))}
                className="form-control"
                placeholder="Nhập động lực cá nhân của bạn..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Số tuần thực hiện:</label>
              <input
                type="number"
                min="2"
                max="12"
                value={formData.totalWeeks}
                onChange={(e) => setFormData(prev => ({ ...prev, totalWeeks: parseInt(e.target.value) || 4 }))}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-control"
              />
            </div>

            <div className="weekly-plans">
              <h4>Kế hoạch giảm theo tuần:</h4>
              {formData.weeklyReductions.map((week, index) => (
                <div key={index} className="week-plan">
                  <label>Tuần {index + 1} - Số điếu thuốc giảm:</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={week.reduction}
                    onChange={(e) => handleWeeklyReductionChange(index, e.target.value)}
                    className="form-control"
                  />
                  <small className="form-text text-muted">
                    Từ {new Date(new Date(formData.startDate).getTime() + (index * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN')} 
                    {' - '} 
                    {new Date(new Date(formData.startDate).getTime() + ((index + 1) * 7 - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                  </small>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={createNewPlan}
              >
                Tạo kế hoạch
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && plan && (
        <div className="create-plan-form">
          <div className="form-header">
            <h3>Chỉnh sửa kế hoạch</h3>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setShowEditForm(false)}
            >
              Quay lại
            </button>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label>Động lực cá nhân:</label>
              <textarea
                value={editFormData.personalMotivation}
                onChange={(e) => setEditFormData(prev => ({ ...prev, personalMotivation: e.target.value }))}
                className="form-control"
                placeholder="Nhập động lực cá nhân của bạn..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Ngày mục tiêu hoàn thành:</label>
              <input
                type="date"
                value={editFormData.targetQuitDate}
                onChange={(e) => setEditFormData(prev => ({ ...prev, targetQuitDate: e.target.value }))}
                className="form-control"
              />
            </div>

            {weeklyPlans.length > 0 && (
              <div className="weekly-plans">
                <h4>Chỉnh sửa kế hoạch theo tuần:</h4>
                {weeklyPlans.map((week, index) => (
                  <div key={index} className="week-plan">
                    <label>Tuần {week.weekNumber} - Số điếu thuốc giảm:</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      defaultValue={week.targetReduction}
                      onChange={(e) => handleEditWeeklyReductionChange(index, e.target.value)}
                      className="form-control"
                    />
                    <small className="form-text text-muted">
                      Từ {new Date(week.weekStartDate).toLocaleDateString('vi-VN')} - {new Date(week.weekEndDate).toLocaleDateString('vi-VN')}
                    </small>
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={updateExistingPlan}
              >
                Cập nhật kế hoạch
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditForm(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {plan && (
        <div className="existing-plan">
          <div className="plan-header">
            <h3>Kế hoạch hiện tại</h3>
            <div className="plan-status">
              <span className="status-badge active">Đang hoạt động</span>
            </div>
          </div>

          <div className="plan-overview">
            <div className="plan-dates">
              <div className="date-item">
                <strong>Ngày bắt đầu:</strong> {new Date(plan.startDate || plan.StartDate).toLocaleDateString('vi-VN')}
              </div>
              <div className="date-item">
                <strong>Ngày mục tiêu:</strong> {new Date(plan.targetQuitDate || plan.TargetQuitDate).toLocaleDateString('vi-VN')}
              </div>
            </div>
            
            <div className="plan-motivation">
              <strong>Động lực:</strong> {plan.personalMotivation || plan.PersonalMotivation}
            </div>
          </div>

          {weeklyPlans.length > 0 && (
            <div className="weekly-plans-display">
              <h4>Kế hoạch theo tuần:</h4>
              <div className="weeks-grid">
                {weeklyPlans.map((week, index) => (
                  <div key={index} className="week-card">
                    <div className="week-header">
                      <h5>Tuần {week.weekNumber}</h5>
                      <span className="reduction-target">{week.targetReduction} điếu giảm</span>
                    </div>
                    <div className="week-dates">
                      {new Date(week.weekStartDate).toLocaleDateString('vi-VN')} - {new Date(week.weekEndDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="plan-actions">
            <button 
              className="btn btn-primary me-2"
              onClick={handleEditPlan}
            >
              <i className="fas fa-edit me-1"></i>
              Chỉnh sửa kế hoạch
            </button>
            <button 
              className="btn btn-warning"
              onClick={() => setShowCreateForm(true)}
            >
              Tạo kế hoạch mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTabNew;
