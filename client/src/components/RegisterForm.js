import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';  // adjust path if needed

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    branch: 'Shimoga',
    role: 'uploader',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      setMessage('✅ ' + res.data.message);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Registration failed'));
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>📝 Register New User</h2>
      <form onSubmit={handleSubmit} style={form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          style={input}
          required
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={input}
          required
        />
        <select name="branch" onChange={handleChange} style={input}>
          <option value="Shimoga">Shimoga</option>
          <option value="Sagara">Sagara</option>
          <option value="Hassan">Hassan</option>
          <option value="Kaduru">Kaduru</option>
          <option value="Chikkamagaluru">Chikkamagaluru</option>
        </select>
        <select name="role" onChange={handleChange} style={input}>
          <option value="uploader">Uploader</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <button type="submit" style={button}>Register</button>
      </form>
      <p style={{ marginTop: '10px' }}>Already registered?</p>
      <a href="/login" style={{ textDecoration: 'none' }}>
        <button style={button}>Go to Login</button>
      </a>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

// Styles
const container = {
  padding: '50px',
  maxWidth: '400px',
  margin: 'auto',
  background: '#fff',
  borderRadius: '10px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};

const title = {
  textAlign: 'center',
  marginBottom: '20px'
};

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const input = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const button = {
  padding: '10px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default RegisterForm;
