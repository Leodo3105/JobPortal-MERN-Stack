import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getCandidateApplications } from '../../redux/slices/applicationSlice';
import moment from 'moment';

const CandidateApplicationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { applications, loading } = useAppSelector((state) => state.application);

  useEffect(() => {
    dispatch(getCandidateApplications());
  }, [dispatch]);

  // Hàm hiển thị trạng thái đơn ứng tuyển
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Chờ xem xét
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Đã xem xét
          </span>
        );
      case 'shortlisted':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Trong danh sách ngắn
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Từ chối
          </span>
        );
      case 'interview':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
            Phỏng vấn
          </span>
        );
      case 'hired':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Đã tuyển
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Đơn ứng tuyển của tôi</h1>

      {loading && applications.length === 0 ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm">
          <p className="text-gray-500">Bạn chưa ứng tuyển vào công việc nào</p>
          <Link
            to="/jobs"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Tìm việc làm ngay
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí ứng tuyển
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Công ty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày ứng tuyển
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((application) => {
                  // Kiểm tra xem job có phải là object hay string
                  const job = typeof application.job === 'object' ? application.job : null;
                  
                  if (!job) return null; // Skip if job is not an object
                  
                  return (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {job.company.logo ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${job.company.logo}`}
                              alt={job.company.name}
                              className="h-8 w-8 mr-3 object-contain"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <span className="text-gray-500 font-medium">
                                {job.company.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span>{job.company.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {moment(application.createdAt).format('DD/MM/YYYY')}
                      </td>
                      <td className="px-6 py-4">
                        {renderStatus(application.status)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          to={`/applications/${application._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateApplicationsPage;