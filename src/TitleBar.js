import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCartShopping, FaUser, FaPlus } from "react-icons/fa6";

const TitleBar = ({ userId, setUserId, search, setSearch }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedUserName = localStorage.getItem('user_name');
    
    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName || 'Account');
      setIsAdmin(storedUserId === '7');
    }
  }, [setUserId]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    setUserId(null);
    setIsAdmin(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (userId) {
      navigate(`/odyssey/${userId}/myprofile`);
      setDropdownOpen(false);
    }
  };

  const handleOrdersClick = () => {
    if (userId) {
      navigate(`/odyssey/${userId}/orders`);
      setDropdownOpen(false);
    }
  };

  const handleAddProductClick = () => {
    navigate('/add-product');
    setDropdownOpen(false);
  };

  const handleAccountClick = () => {
    if (userId) {
      setDropdownOpen(prev => !prev);
    } else {
      navigate('/login');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/product/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: searchQuery })
      });
      
      const data = await response.json();
      console.log(data);
      if (data.message === "No product found") {
        setSearch([]);
      } else {
        setSearch(data);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearch([]);
    }
  };

  return (
    <header className="titlebar">
      <Link to={userId ? (isAdmin ? '/add-product' : `/odyssey/${userId}`) : "/"}><p className="title">ODYSSEY</p></Link>
      
      <form onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          className="search" 
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
        />
      </form>

      <div className="profilefields">
        {isAdmin && (
          <button className="admin-button" onClick={handleAddProductClick}>
            <FaPlus />
            <span>Add Product</span>
          </button>
        )}
        
        <div className="login-wrapper">
          <div className="loginbutton" onClick={handleAccountClick}>
            <FaUser />
            <p>{userId ? userName : 'Login'}</p>
          </div>

          {userId && dropdownOpen && (
            <div className="login-dropdown">
              <p onClick={handleProfileClick}>Edit Profile</p>
              <p onClick={handleOrdersClick}>My Orders</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>

        <Link to="/cart"><div className="cartbutton">
          <FaCartShopping />
          <p>Cart</p>
        </div></Link>
      </div>
    </header>
  );
};

export default TitleBar;