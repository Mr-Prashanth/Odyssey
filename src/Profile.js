import React, { useState } from 'react';
import './Profile.css';


const Profile = ({ userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    street: '',
    area: '',
    city: '',
    pincode: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: userId,
      ...formData
    };
    console.log(userId)

    try {
      const response = await fetch('http://localhost:8000/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      console.log(payload)

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Profile updated successfully!');
      } else {
        setMessage(data.message || 'Update failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong!');
    }
  };

  return (
    <div className="profile-form-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="date" name="dob" placeholder="DOB" onChange={handleChange} required />
        <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
        <input type="text" name="area" placeholder="Area" onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleChange} required />
        <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} required />
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
