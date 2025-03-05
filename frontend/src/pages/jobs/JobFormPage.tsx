import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { createJob, getJobById, updateJob, resetJobError } from '../../redux/slices/jobSlice';
import { toast } from 'react-toastify';
import Select from 'react-select';

const JobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob, loading, error } = useAppSelector((state) => state.job);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Options cho các select
  const jobTypeOptions = [
    { value: 'Full-time', label: 'Toàn thời gian' },
    { value: 'Part-time', label: 'Bán thời gian' },
    { value: 'Remote', label: 'Từ xa' },
    { value: 'Internship', label: 'Thực tập' },
    { value: 'Contract', label: 'Hợp đồng' }
  ];

  const experienceOptions = [
    { value: 'Không yêu cầu', label: 'Không yêu cầu' },
    { value: '1 năm', label: '1 năm' },
    { value: '2 năm', label: '2 năm' },
    { value: '3-5 năm', label: '3-5 năm' },
    { value: '5-10 năm', label: '5-10 năm' },
    { value: 'Trên 10 năm', label: 'Trên 10 năm' }
  ];

  const educationOptions = [
    { value: 'Không yêu cầu', label: 'Không yêu cầu' },
    { value: 'Trung cấp', label: 'Trung cấp' },
    { value: 'Cao đẳng', label: 'Cao đẳng' },
    { value: 'Đại học', label: 'Đại học' },
    { value: 'Thạc sĩ', label: 'Thạc sĩ' },
    { value: 'Tiến sĩ', label: 'Tiến sĩ' }
  ];

  // Load job nếu đang ở chế độ chỉnh sửa
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      dispatch(getJobById(id));
    } else {
      setIsEdit(false);
    }
  }, [dispatch, id]);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetJobError());
    }
  }, [error, dispatch]);

  // Formik
  const formik = useFormik({
    initialValues: {
      title: currentJob?.title || '',
      description: currentJob?.description || '',
      requirements: currentJob?.requirements || '',
      benefits: currentJob?.benefits || '',
      jobType: currentJob?.jobType || [],
      location: currentJob?.location || '',
      salaryMin: currentJob?.salary?.min || '',
      salaryMax: currentJob?.salary?.max || '',
      isNegotiable: currentJob?.salary?.isNegotiable || false,
      currency: currentJob?.salary?.currency || 'VND',
      skills: currentJob?.skills?.join(', ') || '',
      experience: currentJob?.experience || 'Không yêu cầu',
      education: currentJob?.education || 'Không yêu cầu',
      deadline: currentJob?.deadline ? new Date(currentJob.deadline).toISOString().split('T')[0] : '',
      status: currentJob?.status || 'draft'
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Tiêu đề công việc là bắt buộc'),
      description: Yup.string().required('Mô tả công việc là bắt buộc'),
      requirements: Yup.string().required('Yêu cầu công việc là bắt buộc'),
      location: Yup.string().required('Địa điểm làm việc là bắt buộc'),
      deadline: Yup.date().required('Hạn nộp hồ sơ là bắt buộc'),
      jobType: Yup.array().min(1, 'Phải chọn ít nhất một loại công việc')
    }),
    onSubmit: async (values) => {
      try {
        // Xử lý skills: chuyển từ chuỗi thành mảng
        const skillsArray = values.skills 
          ? values.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '')
          : [];

        // Tạo đối tượng dữ liệu để gửi đi
        const jobData = {
          title: values.title,
          description: values.description,
          requirements: values.requirements,
          benefits: values.benefits,
          jobType: values.jobType,
          location: values.location,
          skills: skillsArray,
          experience: values.experience,
          education: values.education,
          deadline: values.deadline,
          status: values.status as 'draft' | 'open' | 'closed',
          salary: {
            min: values.salaryMin ? Number(values.salaryMin) : undefined,
            max: values.salaryMax ? Number(values.salaryMax) : undefined,
            isNegotiable: values.isNegotiable,
            currency: values.currency
          }
        };

        if (isEdit && id) {
          await dispatch(updateJob({ id, jobData }));
          toast.success('Cập nhật tin tuyển dụng thành công');
        } else {
          await dispatch(createJob(jobData));
          toast.success('Tạo tin tuyển dụng thành công');
        }

        // Chuyển hướng về trang quản lý tin tuyển dụng
        navigate('/employer/jobs');
      } catch (error) {
        console.error('Lỗi khi lưu tin tuyển dụng:', error);
      }
    }
  });

  // Helper function để chuyển đổi giá trị từ formik cho react-select
  const getSelectedJobTypes = () => {
    return jobTypeOptions.filter(option => formik.values.jobType.includes(option.value));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
        </h1>

        <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Tiêu đề */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề công việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
            ) : null}
          </div>

          {/* Loại công việc */}
          <div className="mb-4">
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
              Loại công việc <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              id="jobType"
              name="jobType"
              options={jobTypeOptions}
              value={getSelectedJobTypes()}
              onChange={(selectedOptions) => {
                formik.setFieldValue(
                  'jobType',
                  selectedOptions ? selectedOptions.map(option => option.value) : []
                );
              }}
              onBlur={() => formik.setFieldTouched('jobType', true)}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            {formik.touched.jobType && formik.errors.jobType ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.jobType}</div>
            ) : null}
          </div>

          {/* Địa điểm */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Địa điểm làm việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.location && formik.errors.location ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.location}</div>
            ) : null}
          </div>

          {/* Mức lương */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mức lương
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-xs text-gray-500 mb-1">
                  Tối thiểu
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formik.values.salaryMin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-xs text-gray-500 mb-1">
                  Tối đa
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={formik.values.salaryMax}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isNegotiable"
                name="isNegotiable"
                checked={formik.values.isNegotiable}
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isNegotiable" className="ml-2 block text-sm text-gray-700">
                Lương thỏa thuận
              </label>
            </div>
            <div className="mt-2">
              <label htmlFor="currency" className="block text-xs text-gray-500 mb-1">
                Đơn vị tiền tệ
              </label>
              <select
                id="currency"
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Mô tả công việc */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả công việc <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
            ) : null}
          </div>

          {/* Yêu cầu công việc */}
          <div className="mb-4">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Yêu cầu công việc <span className="text-red-500">*</span>
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={5}
              value={formik.values.requirements}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {formik.touched.requirements && formik.errors.requirements ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.requirements}</div>
            ) : null}
          </div>

          {/* Quyền lợi */}
          <div className="mb-4">
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
              Quyền lợi
            </label>
            <textarea
              id="benefits"
              name="benefits"
              rows={5}
              value={formik.values.benefits}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Kỹ năng */}
          <div className="mb-4">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Kỹ năng (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              placeholder="VD: React, JavaScript, TypeScript"
              value={formik.values.skills}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Kinh nghiệm */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Kinh nghiệm
              </label>
              <select
                id="experience"
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Học vấn */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                Trình độ học vấn
              </label>
              <select
                id="education"
                name="education"
                value={formik.values.education}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {educationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div className="mb-4">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Hạn nộp hồ sơ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formik.values.deadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.deadline && formik.errors.deadline ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.deadline}</div>
            ) : null}
          </div>

          {/* Trạng thái */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-draft"
                  name="status"
                  value="draft"
                  checked={formik.values.status === 'draft'}
                  onChange={() => formik.setFieldValue('status', 'draft')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="status-draft" className="ml-2 block text-sm text-gray-700">
                  Bản nháp
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-open"
                  name="status"
                  value="open"
                  checked={formik.values.status === 'open'}
                  onChange={() => formik.setFieldValue('status', 'open')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="status-open" className="ml-2 block text-sm text-gray-700">
                  Đăng tuyển
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-closed"
                  name="status"
                  value="closed"
                  checked={formik.values.status === 'closed'}
                  onChange={() => formik.setFieldValue('status', 'closed')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="status-closed" className="ml-2 block text-sm text-gray-700">
                  Đã đóng
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/employer/jobs')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Đăng tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormPage;