import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderPlaced.css';
import { FaStar } from "react-icons/fa";

const OrderPlaced = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState({}); // Stores ratings before submission
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/order/view?user_id=${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setError('Please login to view your orders');
      setLoading(false);
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'orange';
      case 'confirmed': return 'green';
      case 'shipped': return 'blue';
      case 'delivered': return 'purple';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const handleRatingChange = (productId, rating) => {
    setRatings(prev => ({
      ...prev,
      [productId]: rating
    }));
  };

  const submitRating = async (productId) => {
    if (!ratings[productId]) {
      alert('Please select a rating before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/product/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pro_id: productId,
          rating: ratings[productId],
          user_id: userId // Add user_id if your backend needs it
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Rating submitted successfully!');
        // You might want to update the UI to show the product has been rated
      } else {
        throw new Error(data.message || 'Failed to submit rating');
      }
    } catch (err) {
      console.error("Rating submission error:", err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="order-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-error">
        <p>{error}</p>
        {!userId && (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-empty">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h1 className="order-title">Your Orders</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.order_no} className="order-card">
            <div className="order-header">
              <div className="order-meta">
                <h2>Order #{order.order_no}</h2>
                <p className="order-date">Placed on {new Date(order.order_date || Date.now()).toLocaleDateString()}</p>
              </div>
              <div className="order-summary">
                <p className="order-amount">₹{order.amount.toFixed(2)}</p>
                <p className="order-payment">
                  Payment: {order.payment_mode.toUpperCase()}
                </p>
                <span 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="order-products">
              <h3>Products</h3>
              {order.products.map((product) => (
                <div key={product.pro_id} className="product-item">
                  <div className="product-info">
                    <h4>{product.pro_name}</h4>
                    <p>₹{product.price.toFixed(2)} × {product.qty}</p>
                  </div>
                  <div className="product-total">
                    ₹{(product.price * product.qty).toFixed(2)}
                  </div>
                  
                  {/* Rating Section - Only show for delivered orders */}
                  {/*For now , all orders are shown as delivered  */}
                  {
                  "delivered" === 'delivered' && (
                    <div className="product-rating">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className="star"
                            color={ratings[product.pro_id] >= star ? "#ffc107" : "#e4e5e9"}
                            onClick={() => handleRatingChange(product.pro_id, star)}
                            size={20}
                          />
                        ))}
                      </div>
                      <button
                        className="submit-rating"
                        onClick={() => submitRating(product.pro_id)}
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Rating'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="order-footer">
              <button 
                className="track-order"
                onClick={() => navigate(`/track-order/${order.order_no}`)}
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPlaced;