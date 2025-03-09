import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "./hooks/useRedux";
import { getMe } from "./redux/slices/authSlice";

// Layout
import Navbar from "./components/layout/Navbar";

// Pages
// Home
import HomePage from "./pages/home/HomePage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

// Profile Pages
import CandidateProfilePage from "./pages/profile/CandidateProfilePage";
import EmployerProfilePage from "./pages/profile/EmployerProfilePage";

// Job Pages
import JobSearchPage from "./pages/jobs/JobSearchPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import JobFormPage from "./pages/jobs/JobFormPage";
import EmployerJobPage from "./pages/jobs/EmployerJobPage";
import WishlistPage from './pages/jobs/WishlistPage';

// Application Pages
import CandidateApplicationPage from "./pages/applications/CandidateApplicationPage";
import JobApplicationsPage from "./pages/applications/JobApplicationsPage";
import ApplicationDetailPage from "./pages/applications/ApplicationDetailPage";

//Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";

// Other
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./routes/PrivateRoute";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
    if (localStorage.getItem("token")) {
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
            <Route
              path="/reset-password/:resetToken"
              element={<ResetPasswordPage />}
            />
            <Route
              path="/verify-email/:verificationToken"
              element={<EmailVerificationPage />}
            />

            {/* Jobs Public Routes */}
            <Route path="/jobs/search" element={<JobSearchPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Job Seeker Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/profile" element={<CandidateProfilePage />} />
              <Route
                path="/applications"
                element={<CandidateApplicationPage />}
              />
              <Route
                path="/applications/:id"
                element={<ApplicationDetailPage />}
              />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Route>

            {/* Employer Routes */}
            <Route element={<PrivateRoute allowedRoles={["employer"]} />}>
              <Route
                path="/company-profile"
                element={<EmployerProfilePage />}
              />
              <Route path="/employer/jobs" element={<EmployerJobPage />} />
              <Route path="/employer/jobs/create" element={<JobFormPage />} />
              <Route path="/employer/jobs/edit/:id" element={<JobFormPage />} />
              <Route
                path="/employer/jobs/:jobId/applications"
                element={<JobApplicationsPage />}
              />
              <Route
                path="/employer/applications/:id"
                element={<ApplicationDetailPage />}
              />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/jobs" element={<AdminJobsPage />} />
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
