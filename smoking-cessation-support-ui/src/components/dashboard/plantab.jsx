import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Modal, InputNumber } from 'antd';
import moment from 'moment';
import api from "../../api/axios";
import { toast } from 'react-toastify';

const samplePlan = {
  reason: 'Bảo vệ sức khỏe, tiết kiệm chi phí, làm gương cho con cái',
  stages: '1. Giảm dần số lượng thuốc mỗi ngày\n2. Đặt ngày cai hoàn toàn\n3. Theo dõi và nhận hỗ trợ khi cần',
  startDate: '2025-07-01',
  expectedDate: '2025-08-01',
  support: 'Gia đình, bạn bè, chuyên gia tư vấn',
  goalDays: 30
};

const PlanTab = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [planStatus, setPlanStatus] = useState(""); // trạng thái kế hoạch
  const [plans, setPlans] = useState([]);
  const [progress, setProgress] = useState(null); // Thêm state cho tiến trình

  // Lấy kế hoạch và tiến trình từ API khi load
  useEffect(() => {
    api.get("/GoalPlan").then(res => setPlans(res.data)).catch(() => setPlans([]));
    api.get("/ProgressLog/progress-log").then(res => setProgress(res.data)).catch(() => setProgress(null));
  }, []);

  // Hàm kiểm tra trạng thái hoàn thành dựa vào API
  useEffect(() => {
    if (!plans.length || !progress) {
      setPlanStatus("Bạn chưa tạo kế hoạch cai thuốc.");
      return;
    }
    const plan = plans[0];
    // Tính tổng số ngày không hút thuốc từ progress log
    const daysNoSmoke = progress.reduce((acc, log) => acc + (log.cigarettesSmoked === 0 ? 1 : 0), 0);
    if (plan.goalDays) {
      if (daysNoSmoke >= Number(plan.goalDays)) {
        setPlanStatus("Hoàn thành kế hoạch cai thuốc! 🎉");
      } else {
        setPlanStatus(`Đã không hút thuốc ${daysNoSmoke}/${plan.goalDays} ngày.`);
      }
    } else {
      setPlanStatus("Chưa có dữ liệu tiến trình.");
    }
  }, [plans, progress]);

  const handleSuggestPlan = () => {
    form.setFieldsValue({
      reason: samplePlan.reason,
      stages: samplePlan.stages,
      startDate: samplePlan.startDate ? moment(samplePlan.startDate) : null,
      expectedDate: samplePlan.expectedDate ? moment(samplePlan.expectedDate) : null,
      support: samplePlan.support,
      goalDays: samplePlan.goalDays,
    });
    setModalVisible(true);
  };

  const onFinish = async (values) => {
    try {
      await api.post("/GoalPlan", {
        targetQuitDate: values.expectedDate,
        personalMotivation: values.reason,
        useTemplate: false,
      });
      toast.success("Đã lưu kế hoạch!");
      // Reload lại danh sách kế hoạch
      const res = await api.get("/GoalPlan");
      setPlans(res.data);
    } catch {
      toast.error("Lưu kế hoạch thất bại!");
    }
  };

  return (
    <div>
      <h2>Kế hoạch cai thuốc</h2>
      <div style={{ marginBottom: 16, color: "#1976d2", fontWeight: 600 }}>
        {planStatus}
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Lý do cai thuốc" name="reason" rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
          <Input.TextArea rows={2} placeholder="Nhập lý do bạn muốn cai thuốc..." />
        </Form.Item>
        <Form.Item label="Các giai đoạn" name="stages" rules={[{ required: true, message: 'Vui lòng nhập các giai đoạn!' }]}>
          <Input.TextArea rows={3} placeholder="Nhập các giai đoạn dự kiến..." />
        </Form.Item>
        <Form.Item label="Thời điểm bắt đầu" name="startDate" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Thời điểm dự kiến hoàn thành" name="expectedDate">
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Số ngày mục tiêu không hút thuốc" name="goalDays" rules={[{ required: true, message: 'Vui lòng nhập số ngày mục tiêu!' }]}>
          <InputNumber min={1} placeholder="Nhập số ngày mục tiêu" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Hỗ trợ phát sinh kế hoạch" name="support">
          <Input.TextArea rows={2} placeholder="Nhập các nguồn hỗ trợ (gia đình, bạn bè, chuyên gia...)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Lưu kế hoạch</Button>
          <Button style={{ marginLeft: 8 }} onClick={handleSuggestPlan}>Gợi ý kế hoạch</Button>
        </Form.Item>
      </Form>
      <Modal
        title="Gợi ý kế hoạch mẫu"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Đồng ý"
        cancelText="Đóng"
      >
        <p><b>Lý do:</b> {samplePlan.reason}</p>
        <p><b>Các giai đoạn:</b><br />{samplePlan.stages}</p>
        <p><b>Thời điểm bắt đầu:</b> {samplePlan.startDate}</p>
        <p><b>Thời điểm dự kiến:</b> {samplePlan.expectedDate}</p>
        <p><b>Số ngày mục tiêu:</b> {samplePlan.goalDays}</p>
        <p><b>Hỗ trợ:</b> {samplePlan.support}</p>
      </Modal>
    </div>
  );
};

export default PlanTab;