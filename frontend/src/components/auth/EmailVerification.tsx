import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { verifyEmail, resetAuthError } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const EmailVerification: React.FC = () => {
  const { verificationToken } = useParams<{verificationToken: string}>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (verificationToken) {
      const verify = async () => {
        const result = await dispatch(verifyEmail(verificationToken));
        if (verifyEmail.fulfilled.match(result)) {
          setVerified(true);
          toast.success('Email đã được xác thực thành công!');
        }
      };
      verify();
    }
  }, [verificationToken, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang xác thực email của bạn...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      {verified ? (
        <>
          <div className="mb-4 text-green-600">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Xác thực email thành công!
          </h3>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã xác thực email. Bây giờ bạn có thể sử dụng đầy đủ tính năng của hệ thống.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đi đến Dashboard
          </Link>
        </>
      ) : (
        <>
          <div className="mb-4 text-red-600">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Xác thực email thất bại
          </h3>
          <p className="text-gray-600 mb-4">
            Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại hoặc yêu cầu gửi lại email xác thực.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đi đến Dashboard
          </Link>
        </>
      )}
    </div>
  );
};

export default EmailVerification;