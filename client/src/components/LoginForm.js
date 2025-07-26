import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const userData = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);

      // 🚀 Redirect based on role
      if (userData.role === 'admin') {
        navigate('/dashboard');
      } else if (userData.role === 'uploader') {
        navigate('/upload');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('❌ ' + (err.response?.data?.error || 'Login failed'));
    }
  };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input name="username" onChange={handleChange} placeholder="Username" required />
//         <input name="password" type="text" onChange={handleChange} placeholder="Password" required />
//         <button type="submit">Login</button>
//         {error && <p>{error}</p>}
//       </form>
//     </div>
//   );
// }

// export default LoginForm;


  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2>🔐 Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          style={input}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={input}
        />
        {error && <p style={errorStyle}>{error}</p>}
        <button type="submit" style={button}>Login</button>
      </form>
      </div>
  );
}

// Styles
const container = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#f0f2f5'
};

const formStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  width: '300px'
};

const input = {
  padding: '10px',
  margin: '10px 0',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const button = {
  padding: '10px',
  fontSize: '15px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '6px',
  cursor: 'pointer'
};

const errorStyle = {
  color: 'red',
  fontSize: '13px',
  marginTop: '5px'
};

export default LoginForm;


