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
          
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/history' element={<History />}/>
           <Route path='/statistics' element={<Statistics />}/>
            <Route path='/more-info' element={<MoreInfo />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
