import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { forgotPassword, resetAuthError } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const ForgotPasswordForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [emailSent, setEmailSent] = useState(false);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthError());
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc')
    }),
    onSubmit: async (values) => {
      const result = await dispatch(forgotPassword(values.email));
      if (forgotPassword.fulfilled.match(result)) {
        setEmailSent(true);
        toast.success('Email hướng dẫn đặt lại mật khẩu đã được gửi');
      }
    }
  });

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="mb-4 text-green-600">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Email đã được gửi!
        </h3>
        <p className="text-gray-600 mb-4">
          Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
        </p>
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Quay lại trang đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.email}
          </div>
        ) : null}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Gửi yêu cầu đặt lại mật khẩu'}
        </button>
      </div>

      <div className="text-sm text-center">
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Quay lại đăng nhập
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;