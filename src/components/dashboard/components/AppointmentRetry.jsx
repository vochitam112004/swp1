// Component để retry tải lịch hẹn khi thất bại
import React, { useState } from 'react';

const AppointmentRetry = ({ onRetry, error }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }} />
      </div>
      <h4 className="text-muted mb-3">Không thể tải lịch hẹn</h4>
      <p className="text-muted mb-4">
        {error || "Có lỗi xảy ra khi tải danh sách lịch hẹn. Vui lòng thử lại."}
      </p>
      <button
        className="btn btn-primary"
        onClick={handleRetry}
        disabled={retrying}
      >
        {retrying ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Đang tải lại...
          </>
        ) : (
          <>
            <i className="fas fa-redo me-2" />
            Thử lại
          </>
        )}
      </button>
    </div>
  );
};

export default AppointmentRetry;
