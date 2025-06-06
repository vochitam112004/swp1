import React, { useState, useEffect } from "react";

const QuitPlan = () => {
  const [plan, setPlan] = useState({
    reason: "",
    startDate: "",
    targetDate: "",
    stages: [
      { name: "Giảm số lượng thuốc", deadline: "" },
      { name: "Chỉ hút khi căng thẳng", deadline: "" },
      { name: "Ngưng hoàn toàn", deadline: "" },
    ],
  });

   //  Tải lại dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const savedPlan = localStorage.getItem("quitPlan");
    if (savedPlan) {
      try {
        const parsedPlan = JSON.parse(savedPlan);
        // Kiểm tra cơ bản để tránh lỗi
        if (parsedPlan.reason && parsedPlan.stages?.length === 3) {
          setPlan(parsedPlan);
        }
      } catch (err) {
        console.error("Không thể parse kế hoạch đã lưu:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleStageChange = (index, field, value) => {
    const updatedStages = [...plan.stages];
    updatedStages[index][field] = value;
    setPlan((prev) => ({ ...prev, stages: updatedStages }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  localStorage.setItem("quitPlan", JSON.stringify(plan));
  alert("Kế hoạch đã được lưu thành công!");
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-4">Lập kế hoạch cai thuốc</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Lý do muốn cai thuốc:</label>
          <textarea
            name="reason"
            value={plan.reason}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Ngày bắt đầu:</label>
            <input
              type="date"
              name="startDate"
              value={plan.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Ngày mục tiêu:</label>
            <input
              type="date"
              name="targetDate"
              value={plan.targetDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Các giai đoạn:</label>
          {plan.stages.map((stage, index) => (
            <div key={index} className="mb-2 border p-3 rounded bg-gray-50">
              <p className="font-semibold">{stage.name}</p>
              <input
                type="date"
                value={stage.deadline}
                onChange={(e) =>
                  handleStageChange(index, "deadline", e.target.value)
                }
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Lưu kế hoạch
        </button>
      </form>
    </div>
  );
};

export default QuitPlan;
