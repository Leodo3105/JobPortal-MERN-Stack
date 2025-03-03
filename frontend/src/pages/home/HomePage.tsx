import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="bg-white shadow-md rounded-lg p-8 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Tìm việc làm phù hợp với bạn
          </h1>
          <p className="text-xl text-gray-600">
            Hàng ngàn việc làm mới mỗi ngày từ các công ty hàng đầu
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Từ khóa, vị trí, công ty..."
                className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Địa điểm"
                className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-4xl mb-4">
            <i className="fas fa-search"></i>
          </div>
          <h3 className="text-xl font-bold mb-3">Tìm việc làm</h3>
          <p className="text-gray-600 mb-4">
            Tìm kiếm việc làm phù hợp với kỹ năng và mong muốn của bạn
          </p>
          <Link to="/jobs" className="text-blue-600 hover:underline">
            Xem tất cả việc làm
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-green-600 text-4xl mb-4">
            <i className="fas fa-file-alt"></i>
          </div>
          <h3 className="text-xl font-bold mb-3">Tạo hồ sơ</h3>
          <p className="text-gray-600 mb-4">
            Tạo hồ sơ chuyên nghiệp để thu hút nhà tuyển dụng
          </p>
          {isAuthenticated ? (
            <Link to="/profile" className="text-green-600 hover:underline">
              Cập nhật hồ sơ
            </Link>
          ) : (
            <Link to="/register" className="text-green-600 hover:underline">
              Tạo tài khoản
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-purple-600 text-4xl mb-4">
            <i className="fas fa-building"></i>
          </div>
          <h3 className="text-xl font-bold mb-3">Nhà tuyển dụng</h3>
          <p className="text-gray-600 mb-4">
            Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp
          </p>
          {isAuthenticated ? (
            <Link to="/employer/jobs/create" className="text-purple-600 hover:underline">
              Đăng tin tuyển dụng
            </Link>
          ) : (
            <Link to="/register" className="text-purple-600 hover:underline">
              Đăng ký tài khoản
            </Link>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white p-10 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4">Bạn đã sẵn sàng tìm việc?</h2>
        <p className="text-xl mb-6">
          Hàng ngàn công việc đang chờ đợi bạn. Đăng ký ngay hôm nay!
        </p>
        {!isAuthenticated && (
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            Tạo tài khoản miễn phí
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;