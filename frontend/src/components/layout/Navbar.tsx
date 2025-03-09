import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { logout } from "../../redux/slices/authSlice";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Job<span className="text-gray-800">Portal</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/jobs"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Việc làm
            </Link>
            <Link
              to="/companies"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Công ty
            </Link>
            {isAuthenticated && user?.role === 'user' && (
              <>
                <Link
                  to="/applications"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Đơn ứng tuyển
                </Link>
                <Link
                  to="/wishlist"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Việc làm yêu thích
                </Link>
              </>
            )}
            {isAuthenticated && user?.role === 'employer' && (
              <Link
                to="/employer/jobs"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Quản lý tin tuyển dụng
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Xin chào, {user?.name}
                </div>
                {user?.role === 'user' ? (
                  <Link
                    to="/profile"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Hồ sơ
                  </Link>
                ) : user?.role === 'employer' ? (
                  <Link
                    to="/company-profile"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Hồ sơ công ty
                  </Link>
                ) : null}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/jobs"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Việc làm
              </Link>
              <Link
                to="/companies"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Công ty
              </Link>
              {isAuthenticated && user?.role === 'user' && (
                <>
                  <Link
                    to="/applications"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đơn ứng tuyển
                  </Link>
                  <Link
                    to="/wishlist"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Việc làm yêu thích
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                </>
              )}
              {isAuthenticated && user?.role === 'employer' && (
                <>
                  <Link
                    to="/employer/jobs"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Quản lý tin tuyển dụng
                  </Link>
                  <Link
                    to="/company-profile"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hồ sơ công ty
                  </Link>
                </>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 hover:text-red-800 transition-colors"
                >
                  Đăng xuất
                </button>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;