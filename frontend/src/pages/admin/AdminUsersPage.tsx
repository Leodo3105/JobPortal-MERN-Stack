import React, { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  status: "active" | "inactive";
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/admin/users?page=${page}&limit=10&role=${
          filter !== "all" ? filter : ""
        }&search=${searchTerm}`
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, filter, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });

      // Cập nhật danh sách người dùng
      setUsers(
        users.map((user) =>
          user._id === userId
            ? { ...user, status: newStatus as "active" | "inactive" }
            : user
        )
      );

      toast.success(
        `Đã ${
          newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"
        } tài khoản người dùng`
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg || "Không thể cập nhật trạng thái người dùng"
      );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />

        <div className="flex-1 md:ml-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Quản lý người dùng
          </h1>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-40">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Lọc theo vai trò người dùng"
                >
                  <option value="all">Tất cả</option>
                  <option value="user">Ứng viên</option>
                  <option value="employer">Nhà tuyển dụng</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md text-red-600">
              {error}
            </div>
          ) : users.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tên
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vai trò
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày đăng ký
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {!user.isEmailVerified && (
                            <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                              Chưa xác thực
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "employer"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role === "admin"
                              ? "Admin"
                              : user.role === "employer"
                              ? "Nhà tuyển dụng"
                              : "Ứng viên"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status === "active"
                              ? "Hoạt động"
                              : "Vô hiệu hóa"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              handleToggleUserStatus(user._id, user.status)
                            }
                            className={`text-sm ${
                              user.status === "active"
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {user.status === "active"
                              ? "Vô hiệu hóa"
                              : "Kích hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 flex justify-center">
                  <nav className="flex space-x-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded border ${
                          page === i + 1
                            ? "bg-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg shadow-sm">
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
