import React from 'react';
import { useAppSelector } from '../../hooks/useRedux';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Bảng điều khiển
        </h2>
        <p className="text-gray-600 mb-4">
          Chào mừng {user?.name} ({user?.role === 'user' ? 'Người tìm việc' : 'Nhà tuyển dụng'})
        </p>

        {user?.role === 'user' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                Hồ sơ của bạn
              </h3>
              <p className="text-gray-600 mb-4">
                Cập nhật thông tin cá nhân và CV của bạn
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Quản lý hồ sơ
              </button>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Đơn ứng tuyển
              </h3>
              <p className="text-gray-600 mb-4">
                Xem lại các đơn ứng tuyển của bạn
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Xem đơn ứng tuyển
              </button>
            </div>
          </div>
        )}

        {user?.role === 'employer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                Công ty của bạn
              </h3>
              <p className="text-gray-600 mb-4">
                Quản lý thông tin công ty
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Cập nhật thông tin
              </button>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Tin tuyển dụng
              </h3>
              <p className="text-gray-600 mb-4">
                Đăng và quản lý các tin tuyển dụng
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Quản lý tin tuyển dụng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;