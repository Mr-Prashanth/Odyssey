import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handlesignup(e) {
    e.preventDefault();
    setError('');

    fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: Phone,
        password: Password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
          const userId = data.user_id;
          console.log(userId)
          navigate(`/odyssey/${userId}`);
        
      })
      .catch(error => {
        console.error("Error:", error);
        setError('Something went wrong. Please try again.');
      });
  }

  return (
    <div className="signup-backdrop">

    <div className="signup-container">
    <button 
        className="close-button"
        onClick={() => navigate('/')}
      >
        &times;
      </button>
      <form onSubmit={handlesignup} className="signup-form">
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Mobile Number"
          value={Phone}
          onChange={(e) => setPhone(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />

        <button type="submit" className="signup-button">Sign Up</button>

        {error && <p className="signup-error">{error}</p>}
      </form>
    </div>
    </div>
  );
};

export default SignUp;
