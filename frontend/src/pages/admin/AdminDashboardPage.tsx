import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface StatsData {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  newUsersToday: number;
  newJobsToday: number;
  newApplicationsToday: number;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/stats');
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />
        
        <div className="flex-1 md:ml-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md text-red-600">
              {error}
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Người dùng</h2>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Mới hôm nay: +{stats.newUsersToday}
                  </p>
                  <Link 
                    to="/admin/users"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-4"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Tin tuyển dụng</h2>
                  <p className="text-3xl font-bold text-green-600">{stats.totalJobs}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Mới hôm nay: +{stats.newJobsToday}
                  </p>
                  <Link 
                    to="/admin/jobs"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-4"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Đơn ứng tuyển</h2>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Mới hôm nay: +{stats.newApplicationsToday}
                  </p>
                  <Link 
                    to="/admin/applications"
                    className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-4"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Người dùng mới</h2>
                  {/* Có thể thêm danh sách người dùng mới nhất ở đây */}
                  <Link 
                    to="/admin/users"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Xem tất cả người dùng →
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Tin đăng mới</h2>
                  {/* Có thể thêm danh sách tin đăng mới nhất ở đây */}
                  <Link 
                    to="/admin/jobs"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Xem tất cả tin đăng →
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <p>Không có dữ liệu thống kê</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;