// File: /frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import Onboarding from './pages/Onboarding'; // We'll use this later
// We will create LoginPage and Dashboard soon
// import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* For now, we'll make SignUp the main page. Later, this will be a landing page. */}
        <Route path="/" element={<SignUpPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/onboarding" element={<Onboarding />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
