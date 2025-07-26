


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
// import LoginForm from './components/LoginForm';
// import RegisterForm from './components/RegisterForm';
// import Dashboard from './components/Dashboard';
// import UploadPage from './pages/UploadPage';

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
//     if (token && savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//     if (userData.token) localStorage.setItem('token', userData.token);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   const isAdmin = user?.role === 'admin';
//   const isUploader = user?.role === 'uploader';

//   return (
//     <Router>
//       <div style={{ fontFamily: 'Segoe UI', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>

//         {/* ✅ Rich Top Navbar */}
//         <header style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           backgroundColor: '#fff',
//           padding: '10px 30px',
//           borderBottom: '2px solid #e0e0e0',
//           boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <img src="/logo.png" alt="Logo" style={{ height: '45px', marginRight: '12px' }} />
//             <div>
//               <h2 style={{ margin: 0, fontSize: '20px', color: '#d32f2f' }}>Shakti Toyota</h2>
//               <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Smart Parts Manager</p>
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <nav>
//             <Link to="/dashboard" style={navLink}>Dashboard</Link>
//             <Link to="/upload" style={navLink}>Upload</Link>
//             {user?.role === 'admin' && (
//               <Link to="/admin/register" style={navLink}>Register</Link>
//             )}
//           </nav>

//           {/* User Info and Logout */}
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             {user ? (
//               <>
//                 <span style={{ marginRight: '15px', color: '#444' }}>
//                   👋 {user.username} {user.branch && `(${user.branch})`}
//                 </span>
//                 <button onClick={handleLogout} style={logoutButton}>Logout</button>
//               </>
//             ) : (
//               <Link to="/login" style={{ ...navLink, fontWeight: 'bold' }}>Login</Link>
//             )}
//           </div>
//         </header>

//         {/* Page Content */}
//         <main style={{ padding: '20px 40px' }}>
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" />} />
//             <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
//             <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
//             <Route path="/upload" element={
//               user && (isUploader || isAdmin)
//                 ? <UploadPage />
//                 : <Navigate to="/login" />
//             } />
//             <Route path="/admin/register" element={
//               user && isAdmin
//                 ? <RegisterForm />
//                 : <Navigate to="/login" />
//             } />
//             <Route path="*" element={<div>404 - Page Not Found</div>} />
//           </Routes>


//         </main>
//       </div>
//     </Router>
//   );
// }

// // ✅ Styles
// const navLink = {
//   margin: '0 12px',
//   textDecoration: 'none',
//   fontSize: '15px',
//   color: '#333',
//   fontWeight: '500'
// };

// const logoutButton = {
//   padding: '6px 14px',
//   backgroundColor: '#d32f2f',
//   color: '#fff',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   fontSize: '14px'
// };

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import UploadPage from './pages/UploadPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isUploader = user?.role === 'uploader';

  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>

        {/* ✅ Updated Responsive Top Navbar */}
        <header style={headerStyle}> {/* CHANGED: New responsive header style */}
          {/* Top Row: Logo (left) and Title (right) */}
          <div style={topRow}> {/* CHANGED: New container for logo and title */}
            <img src="/logo.png" alt="Logo" style={logoStyle} />
            {/* <p style={{ margin: 0, fontSize: '18px',fontStyle:'bold', color: '#666' }}>Smart Parts Manager</p> */}
            <p style={{
              margin: 0,
              fontSize: 'clamp(16px, 2vw, 20px)', // responsive font size
              fontWeight: '700',                  // bold weight
              color: '#444',                      // darker gray for better contrast
              letterSpacing: '0.5px',             // slight spacing for modern look
              textTransform: 'uppercase'          // makes it stand out
            }}>
              Smart Parts Manager
            </p>

            <h2 style={titleStyle}>Shakti Toyota</h2>

          </div>

          {/* Navigation Links */}
          <nav style={navContainer}> {/* CHANGED: Responsive nav links container */}
            <Link to="/dashboard" style={navLink}>Dashboard</Link>
            <Link to="/upload" style={navLink}>Upload</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/register" style={navLink}>Register</Link>
            )}
            {user ? (
              <>
                <span style={userInfo}> {/* CHANGED: user info styled for responsive */}
                  👋 {user.username} {user.branch && `(${user.branch})`}
                </span>
                <button onClick={handleLogout} style={logoutButton}>Logout</button>
              </>
            ) : (
              <Link to="/login" style={{ ...navLink, fontWeight: 'bold' }}>Login</Link>
            )}
          </nav>
        </header>

        {/* Page Content */}
        <main style={{ padding: '15px 20px', maxWidth: '100%', overflowX: 'auto' }}> {/* CHANGED: responsive padding */}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
            <Route path="/upload" element={
              user && (isUploader || isAdmin)
                ? <UploadPage />
                : <Navigate to="/login" />
            } />
            <Route path="/admin/register" element={
              user && isAdmin
                ? <RegisterForm />
                : <Navigate to="/login" />
            } />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

/* ---------- Responsive Styles Added ---------- */
const headerStyle = {
  backgroundColor: '#fff',
  padding: '10px 20px',
  borderBottom: '2px solid #e0e0e0',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column', // stack title and nav
  alignItems: 'stretch'
};

const topRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const logoStyle = { height: '40px' };

const titleStyle = { margin: 0, fontSize: '20px', color: '#d32f2f' };

const navContainer = {
  display: 'flex',
  flexWrap: 'wrap', // makes links stack on small screens
  gap: '10px',
  justifyContent: 'flex-start',
  alignItems: 'center'
};

const navLink = {
  margin: '8px 12px',
  textDecoration: 'none',
  fontSize: '15px',
  color: '#333',
  fontWeight: '500'
};

const userInfo = {
  marginLeft: 'auto',
  color: '#444',
  fontSize: '14px'
};

const logoutButton = {
  padding: '6px 14px',
  backgroundColor: '#d32f2f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default App;
