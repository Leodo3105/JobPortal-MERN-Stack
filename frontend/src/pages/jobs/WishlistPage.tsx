import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import moment from 'moment';
import { toast } from 'react-toastify';

const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { wishlist, loading } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = (jobId: string) => {
    dispatch(removeFromWishlist(jobId));
    toast.success('Đã xóa công việc khỏi danh sách yêu thích');
  };

  // Function để format lương
  const formatSalary = (salary?: { min?: number; max?: number; isNegotiable: boolean; currency: string }) => {
    if (!salary) return 'Thỏa thuận';
    
    const { min, max, isNegotiable, currency } = salary;
    
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Công việc yêu thích</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : wishlist.length > 0 ? (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex justify-between">
                <div className="flex-1">
                  <Link to={`/jobs/${item.job._id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600 mb-1 block">
                    {item.job.title}
                  </Link>
                  <p className="text-gray-600 mb-1">{item.job.company.name}</p>
                  <p className="text-gray-500 mb-2">{item.job.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.job.jobType.map((type, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-green-600 font-medium mb-1">{formatSalary(item.job.salary)}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    Đã thêm: {moment(item.createdAt).format('DD/MM/YYYY')}
                  </p>
                  <p className="text-sm">
                    Hạn nộp: {moment(item.job.deadline).format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Link 
                  to={`/jobs/${item.job._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xem chi tiết
                </Link>
                
                <button
                  onClick={() => handleRemoveFromWishlist(item.job._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Bỏ yêu thích
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Bạn chưa có công việc yêu thích nào</p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Tìm việc ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;