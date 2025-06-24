import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Modal, InputNumber } from 'antd';
import moment from 'moment';

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

  // Hàm kiểm tra trạng thái hoàn thành
  const checkPlanStatus = () => {
    const plan = JSON.parse(localStorage.getItem("quitPlan") || "{}");
    const progress = JSON.parse(localStorage.getItem("quitProgress") || "{}");
    if (plan && plan.goalDays) {
      if (progress && progress.daysNoSmoke) {
        if (progress.daysNoSmoke >= Number(plan.goalDays)) {
          setPlanStatus("Hoàn thành kế hoạch cai thuốc! 🎉");
        } else {
          setPlanStatus(`Đã không hút thuốc ${progress.daysNoSmoke}/${plan.goalDays} ngày.`);
        }
      } else {
        setPlanStatus("Chưa có dữ liệu tiến trình.");
      }
    } else {
      setPlanStatus("Bạn chưa tạo kế hoạch cai thuốc.");
    }
  };

  useEffect(() => {
    checkPlanStatus();
    // Lắng nghe sự kiện thay đổi localStorage từ các tab khác
    const handleStorage = (e) => {
      if (e.key === "quitProgress" || e.key === "quitPlan") {
        checkPlanStatus();
      }
    };
    window.addEventListener("storage", handleStorage);

    // Kiểm tra định kỳ để cập nhật trạng thái trong cùng tab
    const interval = setInterval(() => {
      checkPlanStatus();
    }, 1000); // kiểm tra mỗi 1 giây

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

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

  const onFinish = (values) => {
    // Lưu kế hoạch vào localStorage
    localStorage.setItem("quitPlan", JSON.stringify(values));
    checkPlanStatus();
    console.log('Kế hoạch đã lưu:', values);
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