import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Statistics from './pages/Statistics';
import MoreInfo from './pages/MoreInfo';
import ProtectedRoute from './components/ProtectedRoute'; 
import './App.css';

function App() {
  return (
    <>
      <Toaster />
      <Router>
       <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/history"
    element={
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    }
  />
  <Route
    path="/statistics"
    element={
      <ProtectedRoute>
        <Statistics />
      </ProtectedRoute>
    }
  />
  <Route
    path="/more-info"
    element={
      <ProtectedRoute>
        <MoreInfo />
      </ProtectedRoute>
    }
  />
</Routes>
      </Router>
    </>
  );
}

export default App;
