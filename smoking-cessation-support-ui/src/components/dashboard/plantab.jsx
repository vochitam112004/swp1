import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Modal } from 'antd';
import moment from 'moment';

const samplePlan = {
  reason: 'Bảo vệ sức khỏe, tiết kiệm chi phí, làm gương cho con cái',
  stages: '1. Giảm dần số lượng thuốc mỗi ngày\n2. Đặt ngày cai hoàn toàn\n3. Theo dõi và nhận hỗ trợ khi cần',
  startDate: '2025-07-01',
  expectedDate: '2025-08-01',
  support: 'Gia đình, bạn bè, chuyên gia tư vấn'
};

const PlanTab = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSuggestPlan = () => {
    form.setFieldsValue({
      reason: samplePlan.reason,
      stages: samplePlan.stages,
      startDate: samplePlan.startDate ? moment(samplePlan.startDate) : null,
      expectedDate: samplePlan.expectedDate ? moment(samplePlan.expectedDate) : null,
      support: samplePlan.support,
    });
    setModalVisible(true);
  };

  const onFinish = (values) => {
    // Xử lý lưu kế hoạch ở đây, ví dụ gửi API hoặc lưu localStorage
    console.log('Kế hoạch đã lưu:', values);
  };

  return (
    <div>
      <h2>Kế hoạch cai thuốc</h2>
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
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Đồng ý"
        cancelText="Đóng"
      >
        <p><b>Lý do:</b> {samplePlan.reason}</p>
        <p><b>Các giai đoạn:</b><br />{samplePlan.stages}</p>
        <p><b>Thời điểm bắt đầu:</b> {samplePlan.startDate}</p>
        <p><b>Thời điểm dự kiến:</b> {samplePlan.expectedDate}</p>
        <p><b>Hỗ trợ:</b> {samplePlan.support}</p>
      </Modal>
    </div>
  );
};

export default PlanTab;