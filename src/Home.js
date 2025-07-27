import React, { useState, useEffect } from 'react';
import { CiShoppingCart } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ search }) => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch('http://localhost:8000/home');
        const data = await response.json();
        console.log(data);
        
        if (response.ok) {
          setHomeData(data);
        } else {
          setError(data.message || 'Failed to fetch home data');
        }
      } catch (err) {
        setError('Error fetching home data');
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="mainpage">
      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {homeData?.category_products?.slice(0, 4).map((item, index) => (
            <div key={`featured-${index}`} className="product-card">
              <img 
                src={item.product.image_link} 
                alt={item.product.pro_name}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/300?text=Product+Image";
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="top-categories">
        <h2>Top Categories</h2>
        <div className="categories-grid">
          {homeData?.category_products?.reduce((acc, curr) => {
            if (!acc.find(item => item.category === curr.category)) {
              acc.push(curr);
            }
            return acc;
          }, []).slice(0, 6).map((item, index) => (
            <div key={`category-${index}`} className="category-card">
              <img 
                src={item.product.image_link}
                alt={item.category}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/300?text=Category+Image";
                }}
              />
              <h3>{item.category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="trending-products">
        <h2>Trending Now</h2>
        <div className="products-grid">
          {homeData?.trending_products?.slice(0, 8).map((product) => (
            <div key={product.pro_id} className="product-card">
              <img 
                src={product.image_link} 
                alt={product.pro_name}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/300?text=Product+Image";
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
