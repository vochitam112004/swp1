import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('errorCode');
    const momoMessage = params.get('message');

    if (errorCode === '0') {
      setStatus('success');
      setMessage('🎉 Thanh toán thành công! Đang chuyển về trang chính...');
    } else {
      setStatus('error');
      setMessage(`❌ Thanh toán thất bại: ${momoMessage || 'Không rõ lỗi'}`);
    }

    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{status === 'success' ? '✅ Giao dịch thành công' : '⚠️ Giao dịch thất bại'}</h2>
      <p>{message}</p>
    </div>
  );
};

export default PaymentCallback;
