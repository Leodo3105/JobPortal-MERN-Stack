import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { logout } from "../../redux/slices/authSlice";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Job<span className="text-gray-800">Portal</span>
          </Link>
        </div>

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
          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Giới thiệu
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Xin chào, {user?.name}
                </span>
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đăng xuất
              </button>
            </>
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
      </div>
    </header>
  );
};
export default Navbar;
