import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { addEducation, deleteEducation } from '../../../redux/slices/candidateProfileSlice';
import { toast } from 'react-toastify';

const EducationForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.candidateProfile);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, current: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.school || !formData.degree || !formData.fieldOfStudy || !formData.from) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    dispatch(addEducation(formData));
    setFormData({
      school: '',
      degree: '',
      fieldOfStudy: '',
      from: '',
      to: '',
      current: false,
      description: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục học vấn này?')) {
      dispatch(deleteEducation(id));
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Học vấn</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Hủy' : 'Thêm học vấn'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border-b border-gray-200 pb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                Trường học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="school"
                id="school"
                value={formData.school}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                Bằng cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="degree"
                id="degree"
                value={formData.degree}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
              Ngành học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fieldOfStudy"
              id="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                Từ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="from"
                id="from"
                value={formData.from}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                Đến
              </label>
              <input
                type="date"
                name="to"
                id="to"
                value={formData.to}
                onChange={handleChange}
                disabled={formData.current}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <input
                id="current"
                name="current"
                type="checkbox"
                checked={formData.current}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                Đang học
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      )}

      {/* Danh sách học vấn */}
      {profile?.education && profile.education.length > 0 ? (
        <div className="space-y-4">
          {profile.education.map((edu) => (
            <div key={edu._id} className="border border-gray-200 rounded-md p-4 relative">
              <button
                onClick={() => handleDelete(edu._id!)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Xóa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h4 className="font-medium">{edu.school}</h4>
              <p className="text-sm text-gray-600">{edu.degree} - {edu.fieldOfStudy}</p>
              <p className="text-sm text-gray-500">
                {new Date(edu.from).toLocaleDateString('vi-VN')} - {edu.current ? 'Hiện tại' : edu.to ? new Date(edu.to).toLocaleDateString('vi-VN') : ''}
              </p>
              {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">Chưa có thông tin học vấn</p>
      )}
    </div>
  );
};

export default EducationForm;