import React, { useState } from 'react';
import GoalPlanTester from '../components/dashboard/components/GoalPlanTester';
import PlanTabNew from '../components/dashboard/PlanTabNew';
import '../css/Dashboard.css';

/**
 * Test page để kiểm tra GoalPlan functionality
 * Bao gồm cả GoalPlanTester và PlanTabNew component
 */
const GoalPlanTestPage = () => {
  const [activeTab, setActiveTab] = useState('tester');

  return (
    <div className="goalplan-test-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div className="page-header mb-4">
              <h2>🧪 GoalPlan Testing & Development</h2>
              <p className="text-muted">
                Kiểm tra và phát triển tính năng GoalPlan - Kế hoạch cai thuốc
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="nav nav-tabs mb-4" role="tablist">
              <button 
                className={`nav-link ${activeTab === 'tester' ? 'active' : ''}`}
                onClick={() => setActiveTab('tester')}
              >
                🔍 API Tester
              </button>
              <button 
                className={`nav-link ${activeTab === 'ui' ? 'active' : ''}`}
                onClick={() => setActiveTab('ui')}
              >
                🎨 UI Component
              </button>
              <button 
                className={`nav-link ${activeTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('docs')}
              >
                📚 Documentation
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'tester' && (
                <div className="tab-pane active">
                  <GoalPlanTester />
                </div>
              )}

              {activeTab === 'ui' && (
                <div className="tab-pane active">
                  <div className="card">
                    <div className="card-header">
                      <h4>🎨 PlanTabNew Component</h4>
                      <p className="text-muted mb-0">
                        Component chính để tạo và quản lý kế hoạch cai thuốc
                      </p>
                    </div>
                    <div className="card-body">
                      <PlanTabNew />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="tab-pane active">
                  <div className="card">
                    <div className="card-header">
                      <h4>📚 GoalPlan API Documentation</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h5>📡 API Endpoints</h5>
                          <div className="api-docs">
                            <div className="api-endpoint mb-3">
                              <span className="badge bg-success me-2">GET</span>
                              <code>/GoalPlan/current-goal</code>
                              <p className="text-muted mt-1">Lấy kế hoạch hiện tại của user</p>
                            </div>
                            
                            <div className="api-endpoint mb-3">
                              <span className="badge bg-primary me-2">POST</span>
                              <code>/GoalPlan</code>
                              <p className="text-muted mt-1">Tạo kế hoạch mới</p>
                              <details className="mt-2">
                                <summary>Payload Example</summary>
                                <pre className="bg-light p-2 mt-2" style={{fontSize: '0.8em'}}>
{`{
  "startDate": "2025-08-02",
  "targetQuitDate": "2025-09-30", 
  "personalMotivation": "Vì sức khỏe gia đình",
  "isCurrentGoal": true
}`}
                                </pre>
                              </details>
                            </div>

                            <div className="api-endpoint mb-3">
                              <span className="badge bg-warning me-2">PUT</span>
                              <code>/GoalPlan/{id}</code> 
                              <p className="text-muted mt-1">Cập nhật kế hoạch</p>
                            </div>

                            <div className="api-endpoint mb-3">
                              <span className="badge bg-success me-2">GET</span>
                              <code>/GoalPlanWeeklyReduction/plan/{planId}</code>
                              <p className="text-muted mt-1">Lấy kế hoạch giảm theo tuần</p>
                            </div>

                            <div className="api-endpoint mb-3">
                              <span className="badge bg-primary me-2">POST</span>
                              <code>/GoalPlanWeeklyReduction</code>
                              <p className="text-muted mt-1">Tạo kế hoạch giảm tuần</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <h5>🏗️ Data Structure</h5>
                          <div className="data-structure">
                            <h6>GoalPlan Object:</h6>
                            <pre className="bg-light p-3" style={{fontSize: '0.8em'}}>
{`{
  "id": number,
  "startDate": "YYYY-MM-DD",
  "targetQuitDate": "YYYY-MM-DD", 
  "personalMotivation": "string",
  "isCurrentGoal": boolean,
  
  // Backend có thể trả về:
  "StartDate": "YYYY-MM-DD",
  "TargetQuitDate": "YYYY-MM-DD",
  "PersonalMotivation": "string"
}`}
                            </pre>

                            <h6 className="mt-3">WeeklyReduction Object:</h6>
                            <pre className="bg-light p-3" style={{fontSize: '0.8em'}}>
{`{
  "id": number,
  "goalPlanId": number,
  "weekNumber": number,
  "targetReduction": number,
  "weekStartDate": "YYYY-MM-DD",
  "weekEndDate": "YYYY-MM-DD"
}`}
                            </pre>
                          </div>

                          <h5 className="mt-4">🛠️ Helper Functions</h5>
                          <ul className="list-unstyled">
                            <li><code>calculatePlanDuration(plan)</code> - Tính thời gian kế hoạch</li>
                            <li><code>formatPlanDates(plan)</code> - Format ngày tháng hiển thị</li>
                            <li><code>DateUtils.daysDifference()</code> - Tính số ngày chênh lệch</li>
                            <li><code>DateUtils.addWeeks()</code> - Thêm tuần vào ngày</li>
                            <li><code>DateUtils.normalizeFields()</code> - Chuẩn hóa field names</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5>🔄 Validation Rules</h5>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Create Plan:</h6>
                            <ul>
                              <li>startDate không được để trống</li>
                              <li>startDate không được là ngày quá khứ</li>
                              <li>personalMotivation không được để trống</li>
                              <li>totalWeeks phải từ 1-52</li>
                            </ul>
                          </div>
                          <div className="col-md-6">
                            <h6>Update Plan:</h6>
                            <ul>
                              <li>personalMotivation không được để trống</li>
                              <li>targetQuitDate không được để trống</li>
                              <li>targetQuitDate phải sau startDate</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanTestPage;
