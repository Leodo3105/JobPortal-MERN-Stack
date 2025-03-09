import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getJobById } from '../../redux/slices/jobSlice';
import { applyForJob } from '../../redux/slices/applicationSlice';
import { checkWishlistItem, addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import moment from 'moment';
import { toast } from 'react-toastify';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob, loading } = useAppSelector((state) => state.job);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { loading: applyLoading } = useAppSelector((state) => state.application);
  const { profile } = useAppSelector((state) => state.candidateProfile);
  const { isInWishlist, loading: wishlistLoading } = useAppSelector((state) => state.wishlist);
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getJobById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && isAuthenticated && user?.role === 'user') {
      dispatch(checkWishlistItem(id));
    }
  }, [dispatch, id, isAuthenticated, user]);

  const formatSalary = () => {
    if (!currentJob?.salary) return 'Thỏa thuận';
    
    const { min, max, isNegotiable, currency } = currentJob.salary;
    
    if (isNegotiable) return 'Thỏa thuận';
    
    if (min && max) {
      return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} ${currency}`;
    } else if (min) {
      return `Từ ${min.toLocaleString('vi-VN')} ${currency}`;
    } else if (max) {
      return `Đến ${max.toLocaleString('vi-VN')} ${currency}`;
    }
    
    return 'Thỏa thuận';
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để ứng tuyển');
      navigate('/login');
      return;
    }

    if (user?.role !== 'user') {
      toast.error('Chỉ ứng viên mới có thể ứng tuyển');
      return;
    }

    if (!profile?.resumeUrl) {
      toast.error('Vui lòng tải lên CV trước khi ứng tuyển');
      navigate('/profile');
      return;
    }

    if (id) {
      try {
        const result = await dispatch(applyForJob({ jobId: id, coverLetter }));
        if (applyForJob.fulfilled.match(result)) {
          toast.success('Ứng tuyển thành công!');
          setShowApplyModal(false);
          setCoverLetter('');
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra khi ứng tuyển');
      }
    }
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      navigate('/login');
      return;
    }

    if (user?.role !== 'user') {
      toast.error('Chỉ ứng viên mới có thể thêm vào danh sách yêu thích');
      return;
    }

    if (id) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(id));
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        dispatch(addToWishlist(id));
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    }
  };

  if (loading && !currentJob) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">Không tìm thấy thông tin việc làm</p>
          <Link to="/jobs" className="text-blue-600 hover:underline mt-2 inline-block">
            Quay lại trang tìm việc
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex">
          <Link to="/" className="text-gray-500 hover:text-blue-600">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/jobs" className="text-gray-500 hover:text-blue-600">
            Việc làm
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-800">{currentJob.title}</span>
        </nav>
      </div>

      {/* Job Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start">
          <div className="md:mr-6 mb-4 md:mb-0">
            {currentJob.company.logo ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/${currentJob.company.logo}`}
                alt={currentJob.company.name}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md">
                <span className="text-gray-500 text-xl font-bold">
                  {currentJob.company.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {currentJob.title}
            </h1>
            <p className="text-gray-600 mb-1">{currentJob.company.name}</p>
            <p className="text-gray-600 mb-2">{currentJob.location}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {currentJob.jobType.map((type, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
              <span>
                <span className="font-medium">Ngày đăng:</span>{' '}
                {moment(currentJob.createdAt).format('DD/MM/YYYY')}
              </span>
              <span>
                <span className="font-medium">Hạn nộp:</span>{' '}
                {moment(currentJob.deadline).format('DD/MM/YYYY')}
              </span>
              <span>
                <span className="font-medium">Lượt xem:</span> {currentJob.views}
              </span>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-start space-y-2">
            <div className="bg-green-50 px-4 py-2 rounded-md mb-4">
              <span className="text-green-700 font-medium">Mức lương:</span>
              <p className="text-green-600 font-bold text-xl">{formatSalary()}</p>
            </div>

            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
              disabled={user?.role === 'employer'}
            >
              Ứng tuyển ngay
            </button>

            {user?.role === 'user' && (
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md transition-colors w-full ${
                  isInWishlist
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {wishlistLoading ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-current rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isInWishlist ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                        </svg>
                        <span>Bỏ yêu thích</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                        <span>Yêu thích</span>
                      </>
                    )}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả công việc</h2>
            <div className="prose max-w-none">
              {/* Using whitespace-pre-line to preserve formatting */}
              <p className="whitespace-pre-line">{currentJob.description}</p>
            </div>
          </div>

          {/* Job Requirements */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yêu cầu công việc</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{currentJob.requirements}</p>
            </div>
          </div>

          {/* Benefits */}
          {currentJob.benefits && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quyền lợi</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{currentJob.benefits}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {/* Job Summary */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin công việc</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Kinh nghiệm</p>
                <p className="font-medium">{currentJob.experience || 'Không yêu cầu'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Trình độ học vấn</p>
                <p className="font-medium">{currentJob.education || 'Không yêu cầu'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Mức lương</p>
                <p className="font-medium">{formatSalary()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Địa điểm làm việc</p>
                <p className="font-medium">{currentJob.location}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Hạn nộp hồ sơ</p>
                <p className="font-medium">
                  {moment(currentJob.deadline).format('DD/MM/YYYY')}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {currentJob.skills && currentJob.skills.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Kỹ năng</h2>
              <div className="flex flex-wrap gap-2">
                {currentJob.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin công ty</h2>
            <div className="flex items-center mb-3">
              {currentJob.company.logo ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${currentJob.company.logo}`}
                  alt={currentJob.company.name}
                  className="w-12 h-12 object-contain mr-3"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full mr-3">
                  <span className="text-gray-500 font-bold">
                    {currentJob.company.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium">{currentJob.company.name}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ứng tuyển: {currentJob.title}
            </h3>
            
            <div className="mb-4">
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                Thư giới thiệu (không bắt buộc)
              </label>
              <textarea
                id="coverLetter"
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={applyLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {applyLoading ? 'Đang xử lý...' : 'Ứng tuyển'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;