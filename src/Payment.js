import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = ({ userId }) => {
  const [paymentMode, setPaymentMode] = useState('');
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async (mode) => {
    if (!userId) {
      setError('Please login to proceed with payment');
      return;
    }

    setOrderProcessing(true);
    setError('');
    setSuccess('');

    try {
      console.log(userId, mode);
      const response = await fetch('http://localhost:8000/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId,
          mode: mode
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(`Order placed successfully! Order #${data.order_no}`);
        navigate("/odyssey/:user_id/orders")
      } else {
        throw new Error(data.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'Order processing failed');
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate('/cart');
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Complete Your Purchase</h2>
        
        {error && <div className="payment-error">{error}</div>}
        {success && <div className="payment-success">{success}</div>}
        
        <div className="payment-methods">
          <div 
            className={`payment-option ${paymentMode === 'card' ? 'selected' : ''}`}
            onClick={() => setPaymentMode('card')}
          >
            <div className="payment-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <h3>Credit/Debit Card</h3>
            <p>Pay using Visa, Mastercard, Rupay, etc.</p>
          </div>
          
          <div 
            className={`payment-option ${paymentMode === 'upi' ? 'selected' : ''}`}
            onClick={() => setPaymentMode('upi')}
          >
            <div className="payment-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>UPI Payment</h3>
            <p>Pay using UPI apps like Google Pay, PhonePe</p>
          </div>
          
          <div 
            className={`payment-option ${paymentMode === 'cash on delivery' ? 'selected' : ''}`}
            onClick={() => setPaymentMode('cash on delivery')}
          >
            <div className="payment-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Cash on Delivery</h3>
            <p>Pay when you receive your order</p>
          </div>
        </div>
        
        {paymentMode && (
          <div className="payment-actions">
            <button 
              className="pay-now-btn"
              onClick={() => handlePlaceOrder(paymentMode)}
              disabled={orderProcessing}
            >
              {orderProcessing ? 'Processing...' : `Confirm ${paymentMode === 'cash on delivery' ? 'Order' : 'Payment'}`}
            </button>
            
            <button 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={orderProcessing}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;