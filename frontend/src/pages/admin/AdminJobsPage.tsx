// frontend/src/pages/admin/AdminJobsPage.tsx

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { toast } from "react-toastify";

interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
  };
  location: string;
  status: "draft" | "open" | "closed" | "pending" | "rejected";
  isApproved: boolean;
  createdAt: string;
  deadline: string;
  employer: {
    _id: string;
    name: string;
  };
}

const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/jobs?page=${page}&limit=10&status=${filter !== 'all' ? filter : ''}&search=${searchTerm}`);
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Không thể tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  }, [page, filter, searchTerm]);
  
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleApproveJob = async (jobId: string) => {
    try {
      await api.patch(`/admin/jobs/${jobId}/approve`);

      // Cập nhật danh sách tin tuyển dụng
      setJobs(
        jobs.map((job) =>
          job._id === jobId
            ? {
                ...job,
                isApproved: true,
                status: "open" as
                  | "draft"
                  | "open"
                  | "closed"
                  | "pending"
                  | "rejected",
              }
            : job
        )
      );

      toast.success("Đã duyệt tin tuyển dụng");
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg || "Không thể duyệt tin tuyển dụng"
      );
    }
  };

  const handleRejectJob = async (jobId: string) => {
    try {
      await api.patch(`/admin/jobs/${jobId}/reject`);

      // Cập nhật danh sách tin tuyển dụng
      setJobs(
        jobs.map((job) =>
          job._id === jobId
            ? {
                ...job,
                isApproved: false,
                status: "rejected" as
                  | "draft"
                  | "open"
                  | "closed"
                  | "pending"
                  | "rejected",
              }
            : job
        )
      );

      toast.success("Đã từ chối tin tuyển dụng");
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg || "Không thể từ chối tin tuyển dụng"
      );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />

        <div className="flex-1 md:ml-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Quản lý tin tuyển dụng
          </h1>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, công ty..."
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
                  aria-label="Lọc trạng thái tin tuyển dụng"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="open">Đang mở</option>
                  <option value="closed">Đã đóng</option>
                  <option value="rejected">Từ chối</option>
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

          {/* Jobs List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md text-red-600">
              {error}
            </div>
          ) : jobs.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tiêu đề
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Công ty
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày đăng
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hạn nộp
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
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {job.company.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.deadline).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              job.status === "open"
                                ? "bg-green-100 text-green-800"
                                : job.status === "closed"
                                ? "bg-red-100 text-red-800"
                                : job.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : job.status === "rejected"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {job.status === "open"
                              ? "Đang mở"
                              : job.status === "closed"
                              ? "Đã đóng"
                              : job.status === "pending"
                              ? "Chờ duyệt"
                              : job.status === "rejected"
                              ? "Từ chối"
                              : "Nháp"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {job.status === "pending" ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveJob(job._id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleRejectJob(job._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <Link
                              to={`/jobs/${job._id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Xem chi tiết
                            </Link>
                          )}
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
              <p className="text-gray-500">Không tìm thấy tin tuyển dụng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobsPage;
