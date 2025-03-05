import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getApplication } from '../../redux/slices/applicationSlice';
import moment from 'moment';

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentApplication, loading } = useAppSelector((state) => state.application);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getApplication(id));
    }
  }, [dispatch, id]);

  // Kiểm tra xem job và candidate có phải là object không
  const job = currentApplication && typeof currentApplication.job === 'object' ? currentApplication.job : null;
  const candidate = currentApplication && typeof currentApplication.candidate === 'object' ? currentApplication.candidate : null;

  // Hàm hiển thị trạng thái đơn ứng tuyển
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            Chờ xem xét
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Đã xem xét
          </span>
        );
      case 'shortlisted':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Trong danh sách ngắn
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            Từ chối
          </span>
        );
      case 'interview':
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            Phỏng vấn
          </span>
        );
      case 'hired':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Đã tuyển
          </span>
        );
      default:
        return null;
    }
  };

  if (loading && !currentApplication) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentApplication || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">Không tìm thấy thông tin đơn ứng tuyển</p>
          {user?.role === 'user' ? (
            <Link to="/applications" className="text-blue-600 hover:underline mt-2 inline-block">
              Quay lại danh sách đơn ứng tuyển
            </Link>
          ) : (
            <Link to="/employer/jobs" className="text-blue-600 hover:underline mt-2 inline-block">
              Quay lại danh sách tin tuyển dụng
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex">
          {user?.role === 'user' ? (
            <>
              <Link to="/dashboard" className="text-gray-500 hover:text-blue-600">
                Dashboard
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link to="/applications" className="text-gray-500 hover:text-blue-600">
                Đơn ứng tuyển
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-800">Chi tiết đơn ứng tuyển</span>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-500 hover:text-blue-600">
                Dashboard
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link to="/employer/jobs" className="text-gray-500 hover:text-blue-600">
                Tin tuyển dụng
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link
                to={`/employer/jobs/${job._id}/applications`}
                className="text-gray-500 hover:text-blue-600"
              >
                Ứng viên
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-800">Chi tiết đơn ứng tuyển</span>
            </>
          )}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Application Header */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {job.title}
                </h1>
                <p className="text-gray-600">{job.company.name}</p>
                <div className="flex items-center mt-4">
                  <span className="text-gray-600 mr-4">Trạng thái:</span>
                  {renderStatus(currentApplication.status)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Ngày ứng tuyển: {moment(currentApplication.createdAt).format('DD/MM/YYYY')}
                </p>
                <Link
                  to={`/jobs/${job._id}`}
                  className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                >
                  Xem tin tuyển dụng
                </Link>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {currentApplication.coverLetter && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thư giới thiệu</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{currentApplication.coverLetter}</p>
              </div>
            </div>
          )}

          {/* Employer Notes (only visible to employers) */}
          {user?.role === 'employer' && currentApplication.notes && currentApplication.notes.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ghi chú</h2>
              <div className="space-y-4">
                {currentApplication.notes.map((note, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="whitespace-pre-line">{note.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {moment(note.createdAt).format('DD/MM/YYYY HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {/* Candidate Info */}
          {user?.role === 'employer' && candidate && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin ứng viên</h2>
              <div>
                <p className="font-medium">{candidate.name}</p>
                <p className="text-gray-600">{candidate.email}</p>
              </div>
            </div>
          )}

          {/* Resume */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">CV của ứng viên</h2>
            <div className="flex items-center">
              <svg className="w-8 h-8 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                <path d="M3 8a2 2 0 012-2h2.5a1 1 0 110 2H5v4.5a1.5 1.5 0 01-3 0V8z" />
              </svg>
              <a
                href={`${process.env.REACT_APP_API_URL}/${currentApplication.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Xem CV
              </a>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;