import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({userId , setUserId}) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!mobile || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mobile,
          password: password,
        }),
      });

      const data = await response.json();
      
      if (data.user_id) {
        // Store user data in localStorage
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_name", data.name || "User");
        setUserId(data.user_id);
        navigate(`/odyssey/${data.user_id}`);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!name || !dob || !mobile || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          phone: mobile,
          password: password,
          dob: dob,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user_id) {
        // Store user data in localStorage
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_name", name);
        setUserId(data.user_id);
        navigate(`/odyssey/${data.user_id}`);
      } else if (response.status === 409) {
        setError("User already exists. Try logging in instead.");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-backdrop">
    <div className="login-container">
    <button 
        className="close-button"
        onClick={() => navigate('/')}
      >
        &times;
      </button>

      <div className="login-form-container">
        <div className="login-form">
          <h2>{isSignUp ? "Create Account" : "Login"}</h2>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp && (
              <>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Mobile Number:</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button">
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="toggle-form" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp 
              ? "Already have an account? Login" 
              : "Need an account? Sign up"}
          </div>
        </div>
      </div>
    </div>
    </div>  
  );
};

export default Login;