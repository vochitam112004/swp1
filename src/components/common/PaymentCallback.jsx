import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import api from '../../api/axios';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [message, setMessage] = useState('Đang xử lý thanh toán...');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Lấy các tham số từ URL callback của MoMo
        const orderId = searchParams.get('orderId');
        const resultCode = searchParams.get('resultCode');
        const amount = searchParams.get('amount');
        const orderInfo = searchParams.get('orderInfo');
        const payType = searchParams.get('payType');
        const transId = searchParams.get('transId');

        console.log('🎯 MoMo Callback Parameters:', {
          orderId,
          resultCode,
          amount,
          orderInfo,
          payType,
          transId
        });

        setPaymentInfo({
          orderId,
          resultCode,
          amount,
          orderInfo,
          payType,
          transId
        });

        if (resultCode === '0') {
          // Thanh toán thành công
          console.log('✅ Payment successful!');
          
          // Gọi API backend để xác nhận thanh toán
          try {
            await api.post('/api/UserMembershipPayment/ConfirmPayment', {
              orderId,
              transId,
              amount,
              resultCode
            });
            
            setStatus('success');
            setMessage('Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
            
            // Chuyển hướng về trang chủ sau 3 giây
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
            
          } catch (confirmError) {
            console.error('❌ Error confirming payment:', confirmError);
            setStatus('success');
            setMessage('Thanh toán thành công! Tuy nhiên có lỗi xác nhận, vui lòng liên hệ hỗ trợ.');
          }
          
        } else {
          // Thanh toán thất bại
          console.log('❌ Payment failed with resultCode:', resultCode);
          setStatus('failed');
          
          // Các mã lỗi phổ biến của MoMo
          const errorMessages = {
            '1': 'Thanh toán thất bại do lỗi hệ thống',
            '2': 'Giao dịch bị từ chối bởi nhà phát hành thẻ',
            '7': 'Trừ tiền thành công tại MoMo, giao dịch đang được xử lý',
            '9': 'Giao dịch được xác nhận thành công nhưng bị thất bại do lỗi hệ thống',
            '10': 'Giao dịch thất bại do tài khoản người dùng chưa được kích hoạt',
            '11': 'Giao dịch thất bại do tài khoản người dùng bị khóa',
            '12': 'Giao dịch thất bại do tài khoản người dùng chưa đủ số dư',
            '13': 'Giao dịch thất bại do sai thông tin xác thực',
            '20': 'Giao dịch thất bại do không đúng OTP',
            '21': 'Giao dịch thất bại do quá thời gian xác thực OTP'
          };
          
          setMessage(errorMessages[resultCode] || 'Thanh toán thất bại. Vui lòng thử lại.');
        }
        
      } catch (error) {
        console.error('❌ Error processing payment callback:', error);
        setStatus('failed');
        setMessage('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
      }
    };

    processPaymentCallback();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/membership');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, mb: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
        {status === 'processing' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" fontWeight={600} mb={2}>
              Đang xử lý thanh toán...
            </Typography>
            <Typography color="text.secondary">
              Vui lòng đợi trong giây lát
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h5" fontWeight={600} mb={2} color="success.main">
              Thanh toán thành công!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
            {paymentInfo && (
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thông tin giao dịch:
                </Typography>
                <Typography>Mã đơn hàng: <strong>{paymentInfo.orderId}</strong></Typography>
                <Typography>Số tiền: <strong>{parseInt(paymentInfo.amount || 0).toLocaleString()}đ</strong></Typography>
                <Typography>Mã giao dịch: <strong>{paymentInfo.transId}</strong></Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" mb={3}>
              Bạn sẽ được chuyển hướng về trang chủ trong giây lát...
            </Typography>
            <Button variant="contained" onClick={handleGoHome} fullWidth>
              Về trang chủ ngay
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h5" fontWeight={600} mb={2} color="error.main">
              Thanh toán thất bại
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
            {paymentInfo && paymentInfo.resultCode && (
              <Typography variant="body2" color="text.secondary" mb={3}>
                Mã lỗi: {paymentInfo.resultCode}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleGoHome} fullWidth>
                Về trang chủ
              </Button>
              <Button variant="contained" onClick={handleRetry} fullWidth>
                Thử lại
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
