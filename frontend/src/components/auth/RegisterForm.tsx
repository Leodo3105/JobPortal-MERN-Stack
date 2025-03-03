import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { register, resetAuthError } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const RegisterForm: React.FC = () => {
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên là bắt buộc'),
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
      password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Mật khẩu là bắt buộc'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),
      role: Yup.string().required('Vai trò là bắt buộc')
    }),
    onSubmit: (values) => {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      };
      dispatch(register(userData));
    }
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Họ và tên
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.name}
          </div>
        ) : null}
      </div>

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
            autoComplete="new-password"
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

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Xác nhận mật khẩu
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.confirmPassword}
          </div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Vai trò
        </label>
        <div className="mt-1">
          <select
            id="role"
            name="role"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="user">Người tìm việc</option>
            <option value="employer">Nhà tuyển dụng</option>
          </select>
        </div>
        {formik.touched.role && formik.errors.role ? (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.role}
          </div>
        ) : null}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </div>

      <div className="text-sm text-center">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Đăng nhập
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;