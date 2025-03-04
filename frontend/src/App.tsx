import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch } from './hooks/useRedux';
import { getMe } from './redux/slices/authSlice';

// Layout
import Navbar from './components/layout/Navbar';

// Pages
import HomePage from './pages/home/HomePage'; 
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CandidateProfilePage from './pages/profile/CandidateProfilePage';
import EmployerProfilePage from './pages/profile/EmployerProfilePage';
import PrivateRoute from './routes/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
    if (localStorage.getItem('token')) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
            <Route path="/verify-email/:verificationToken" element={<EmailVerificationPage />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
            {/* Job Seeker Routes */}
            <Route element={<PrivateRoute allowedRoles={['user']} />}>
              <Route path="/profile" element={<CandidateProfilePage />} />
            </Route>
            
            {/* Employer Routes */}
            <Route element={<PrivateRoute allowedRoles={['employer']} />}>
              <Route path="/company-profile" element={<EmployerProfilePage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              {/* Các route dành riêng cho admin */}
            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {/* Footer có thể thêm vào đây */}
      </div>
    </Router>
  );
};

export default App;