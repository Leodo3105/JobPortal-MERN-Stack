import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { createOrUpdateProfile, resetProfileError } from '../../../redux/slices/employerProfileSlice';
import { toast } from 'react-toastify';

const CompanyProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.employerProfile);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProfileError());
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialValues: {
      companyName: profile?.companyName || '',
      website: profile?.website || '',
      industry: profile?.industry || '',
      companySize: profile?.companySize || '',
      foundedYear: profile?.foundedYear || '',
      description: profile?.description || '',
      contactEmail: profile?.contactEmail || '',
      contactPhone: profile?.contactPhone || '',
      linkedin: profile?.socialLinks?.linkedin || '',
      facebook: profile?.socialLinks?.facebook || '',
      twitter: profile?.socialLinks?.twitter || ''
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required('Tên công ty là bắt buộc'),
      website: Yup.string().url('Địa chỉ URL không hợp lệ'),
      industry: Yup.string(),
      companySize: Yup.string(),
      foundedYear: Yup.number().integer('Năm phải là số nguyên').min(1800, 'Năm không hợp lệ').max(new Date().getFullYear(), 'Năm không hợp lệ'),
      description: Yup.string(),
      contactEmail: Yup.string().email('Email không hợp lệ'),
      contactPhone: Yup.string(),
      linkedin: Yup.string().url('Địa chỉ URL không hợp lệ'),
      facebook: Yup.string().url('Địa chỉ URL không hợp lệ'),
      twitter: Yup.string().url('Địa chỉ URL không hợp lệ')
    }),
    onSubmit: (values) => {
      const profileData = {
        companyName: values.companyName,
        website: values.website,
        industry: values.industry,
        companySize: values.companySize,
        foundedYear: values.foundedYear ? parseInt(values.foundedYear.toString()) : undefined,
        description: values.description,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        socialLinks: {
          linkedin: values.linkedin,
          facebook: values.facebook,
          twitter: values.twitter
        }
      };
      
      dispatch(createOrUpdateProfile(profileData));
      toast.success('Thông tin công ty đã được cập nhật');
    },
    enableReinitialize: true
  });

  const companySizes = [
    { value: '', label: 'Chọn quy mô công ty' },
    { value: '1-10', label: '1-10 nhân viên' },
    { value: '11-50', label: '11-50 nhân viên' },
    { value: '51-200', label: '51-200 nhân viên' },
    { value: '201-500', label: '201-500 nhân viên' },
    { value: '501-1000', label: '501-1000 nhân viên' },
    { value: '1000+', label: 'Hơn 1000 nhân viên' }
  ];

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Tên công ty
        </label>
        <div className="mt-1">
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.companyName}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.companyName && formik.errors.companyName ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.companyName}</div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <div className="mt-1">
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.website}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {formik.touched.website && formik.errors.website ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.website}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Ngành nghề
          </label>
          <div className="mt-1">
            <input
              id="industry"
              name="industry"
              type="text"
              placeholder="Ví dụ: Công nghệ thông tin, Tài chính, ..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.industry}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {formik.touched.industry && formik.errors.industry ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.industry}</div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
            Quy mô công ty
          </label>
          <div className="mt-1">
            <select
              id="companySize"
              name="companySize"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companySize}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          {formik.touched.companySize && formik.errors.companySize ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.companySize}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
            Năm thành lập
          </label>
          <div className="mt-1">
            <input
              id="foundedYear"
              name="foundedYear"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              placeholder="Ví dụ: 2010"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.foundedYear}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {formik.touched.foundedYear && formik.errors.foundedYear ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.foundedYear}</div>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Giới thiệu công ty
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        {formik.touched.description && formik.errors.description ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
            Email liên hệ
          </label>
          <div className="mt-1">
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              placeholder="contact@example.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.contactEmail}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {formik.touched.contactEmail && formik.errors.contactEmail ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.contactEmail}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
            Số điện thoại liên hệ
          </label>
          <div className="mt-1">
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.contactPhone}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {formik.touched.contactPhone && formik.errors.contactPhone ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.contactPhone}</div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Liên kết mạng xã hội</h3>
      </div>

      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
          LinkedIn
        </label>
        <div className="mt-1">
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            placeholder="https://linkedin.com/company/example"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.linkedin}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.linkedin && formik.errors.linkedin ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.linkedin}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
          Facebook
        </label>
        <div className="mt-1">
          <input
            id="facebook"
            name="facebook"
            type="url"
            placeholder="https://facebook.com/example"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.facebook}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.facebook && formik.errors.facebook ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.facebook}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
          Twitter
        </label>
        <div className="mt-1">
          <input
            id="twitter"
            name="twitter"
            type="url"
            placeholder="https://twitter.com/example"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.twitter}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.twitter && formik.errors.twitter ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.twitter}</div>
        ) : null}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </div>
    </form>
  );
};

export default CompanyProfileForm;