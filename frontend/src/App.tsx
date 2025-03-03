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
import DashboardPage from './pages/dashboard/DashboardPage';
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
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
            {/* Job Seeker Routes */}
            <Route element={<PrivateRoute allowedRoles={['user']} />}>
              {/* Các route dành riêng cho người tìm việc */}
            </Route>
            
            {/* Employer Routes */}
            <Route element={<PrivateRoute allowedRoles={['employer']} />}>
              {/* Các route dành riêng cho nhà tuyển dụng */}
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