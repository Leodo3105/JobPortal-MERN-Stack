import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { login, resetAuthError } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
      password: Yup.string().required('Mật khẩu là bắt buộc')
    }),
    onSubmit: (values) => {
      dispatch(login(values));
    }
  });

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
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mật khẩu
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.password}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Ghi nhớ đăng nhập
          </label>
        </div>

        <div className="text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </div>

      <div className="text-sm text-center">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
          Đăng ký
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;