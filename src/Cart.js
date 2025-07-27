import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClearing, setIsClearing] = useState(false); // New state for clear operation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:8000/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId })
        });
        
        const data = await response.json();
        if (response.ok) {
          setCartItems(data);
        } else {
          setError(data.message || "Failed to fetch cart items");
        }
      } catch (err) {
        setError("Error fetching cart items");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCartItems();
    } else {
      setError("Please login to view your cart");
      setLoading(false);
    }
  }, [userId]);

  const handleClearCart = async () => {
    if (!userId) {
      setError("Please login to manage your cart");
      return;
    }

    setIsClearing(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:8000/cart/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      
      const data = await response.json();
      if (response.ok) {
        setCartItems([]);
        // Optional: Show success message
        // setSuccessMessage("Cart cleared successfully");
      } else {
        setError(data.message || "Failed to clear cart");
      }
    } catch (err) {
      setError("Error clearing cart");
      console.error("Clear cart error:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    navigate('/payment');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-error">
        <p>{error}</p>
        {!userId && (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.cart_id} className="cart-item">
            <div className="item-image">
              <img 
                src={item.image_link} 
                alt={item.pro_name} 
                className="cart-item-image"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/150?text=Product+Image";
                }}
              />
            </div>
            <div className="item-info">
              <h3 className="item-name">{item.pro_name}</h3>
              <p className="item-price">₹{item.price}</p>
              <p className="item-quantity">Quantity: {item.quantity}</p>
              <p className="item-size">Size: {item.size}</p>
            </div>
            <div className="item-total">
              <p>₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>FREE</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
      </div>
      
      <div className="cart-actions">
        <button 
          className="clear-cart"
          onClick={handleClearCart}
          disabled={isClearing}
        >
          {isClearing ? 'Clearing...' : 'Clear Cart'}
        </button>
        <button 
          className="proceed-to-payment"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;