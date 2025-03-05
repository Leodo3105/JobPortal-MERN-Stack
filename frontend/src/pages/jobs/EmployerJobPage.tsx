import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getEmployerJobs, updateJobStatus, deleteJob } from '../../redux/slices/jobSlice';
import moment from 'moment';
import { toast } from 'react-toastify';

const EmployerJobPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.job);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getEmployerJobs());
  }, [dispatch]);

  // Xử lý khi thay đổi trạng thái công việc
  const handleStatusChange = async (job_id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as 'draft' | 'open' | 'closed';
    try {
      await dispatch(updateJobStatus({ id: job_id, status }));
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  // Xác nhận xóa công việc
  const confirmDelete = (job_id: string) => {
    setJobToDelete(job_id);
    setShowDeleteModal(true);
  };

  // Xóa công việc
  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      await dispatch(deleteJob(jobToDelete));
      toast.success('Xóa tin tuyển dụng thành công');
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      console.error('Lỗi khi xóa tin tuyển dụng:', error);
      toast.error('Có lỗi xảy ra khi xóa tin tuyển dụng');
    }
  };

  // Hiển thị trạng thái công việc
  const renderStatus = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Nháp</span>;
      case 'open':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đang mở</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Đã đóng</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý tin tuyển dụng</h1>
        <Link
          to="/employer/jobs/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Đăng tin mới
        </Link>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Bạn chưa đăng tin tuyển dụng nào</p>
          <Link
            to="/employer/jobs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đăng tin ngay
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hạn nộp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ứng viên
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {moment(job.createdAt).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {moment(job.deadline).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link 
                        to={`/employer/jobs/${job._id}/applications`} 
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {job.applications?.length || 0} ứng viên
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col space-y-2">
                        {renderStatus(job.status)}
                        <select
                          aria-label="Đổi trạng thái tin tuyển dụng"
                          title="Đổi trạng thái"
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="draft">Nháp</option>
                          <option value="open">Đang mở</option>
                          <option value="closed">Đã đóng</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Link
                          to={`/employer/jobs/edit/${job._id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Chỉnh sửa
                        </Link>
                        <button
                          onClick={() => confirmDelete(job._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-500 mb-4">
              Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobPage;