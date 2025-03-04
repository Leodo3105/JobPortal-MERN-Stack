import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { addSkill, deleteSkill } from '../../../redux/slices/candidateProfileSlice';
import { toast } from 'react-toastify';

const SkillsForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.candidateProfile);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Vui lòng nhập tên kỹ năng');
      return;
    }

    dispatch(addSkill(formData));
    setFormData({
      name: '',
      level: 'Intermediate'
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kỹ năng này?')) {
      dispatch(deleteSkill(id));
    }
  };

  // Map level sang tiếng Việt hiển thị
  const getLevelName = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'Cơ bản';
      case 'Intermediate':
        return 'Trung bình';
      case 'Advanced':
        return 'Nâng cao';
      case 'Expert':
        return 'Chuyên gia';
      default:
        return level;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Kỹ năng</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Hủy' : 'Thêm kỹ năng'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border-b border-gray-200 pb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tên kỹ năng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                Mức độ thành thạo
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Beginner">Cơ bản</option>
                <option value="Intermediate">Trung bình</option>
                <option value="Advanced">Nâng cao</option>
                <option value="Expert">Chuyên gia</option>
              </select>
            </div>
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

      {/* Danh sách kỹ năng */}
      {profile?.skills && profile.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <div 
              key={skill._id} 
              className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800"
            >
              {skill.name} - {getLevelName(skill.level)}
              <button
                onClick={() => handleDelete(skill._id!)}
                className="ml-2 text-gray-500 hover:text-red-500"
                title="Xóa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">Chưa có thông tin kỹ năng</p>
      )}
    </div>
  );
};

export default SkillsForm;