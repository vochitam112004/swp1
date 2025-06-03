import React, { useState } from 'react';

function Payment() {
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage('Payment successful! Thank you for your purchase.');
    }, 2000);
  };

  return (
    <div className="payment-container">
      <h2>Membership Payment</h2>
      <div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </label>
      </div>
      <div>
        <label>
          Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bankTransfer">Bank Transfer</option>
          </select>
        </label>
      </div>
      <button onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Payment;