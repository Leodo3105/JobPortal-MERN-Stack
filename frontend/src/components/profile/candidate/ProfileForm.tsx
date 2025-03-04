import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { createOrUpdateProfile, resetProfileError } from '../../../redux/slices/candidateProfileSlice';
import { toast } from 'react-toastify';

const ProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.candidateProfile);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProfileError());
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialValues: {
      headline: profile?.headline || '',
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      bio: profile?.bio || '',
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      website: profile?.socialLinks?.website || ''
    },
    validationSchema: Yup.object({
      headline: Yup.string().max(100, 'Tiêu đề không thể vượt quá 100 ký tự'),
      dateOfBirth: Yup.date().nullable(),
      phone: Yup.string(),
      address: Yup.string(),
      bio: Yup.string().max(500, 'Giới thiệu không thể vượt quá 500 ký tự'),
      linkedin: Yup.string().url('Địa chỉ URL không hợp lệ'),
      github: Yup.string().url('Địa chỉ URL không hợp lệ'),
      website: Yup.string().url('Địa chỉ URL không hợp lệ')
    }),
    onSubmit: (values) => {
      const profileData = {
        headline: values.headline,
        dateOfBirth: values.dateOfBirth,
        phone: values.phone,
        address: values.address,
        bio: values.bio,
        socialLinks: {
          linkedin: values.linkedin,
          github: values.github,
          website: values.website
        }
      };
      
      dispatch(createOrUpdateProfile(profileData));
      toast.success('Thông tin hồ sơ đã được cập nhật');
    },
    enableReinitialize: true
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
          Tiêu đề hồ sơ
        </label>
        <div className="mt-1">
          <input
            id="headline"
            name="headline"
            type="text"
            placeholder="Ví dụ: Senior Frontend Developer | React | TypeScript"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.headline}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.headline && formik.errors.headline ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.headline}</div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          <div className="mt-1">
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dateOfBirth}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.dateOfBirth}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <div className="mt-1">
            <input
              id="phone"
              name="phone"
              type="tel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Địa chỉ
        </label>
        <div className="mt-1">
          <input
            id="address"
            name="address"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.address && formik.errors.address ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.address}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Giới thiệu bản thân
        </label>
        <div className="mt-1">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bio}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        {formik.touched.bio && formik.errors.bio ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.bio}</div>
        ) : null}
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
            placeholder="https://linkedin.com/in/username"
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
        <label htmlFor="github" className="block text-sm font-medium text-gray-700">
          GitHub
        </label>
        <div className="mt-1">
          <input
            id="github"
            name="github"
            type="url"
            placeholder="https://github.com/username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.github}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formik.touched.github && formik.errors.github ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.github}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website cá nhân
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

export default ProfileForm;