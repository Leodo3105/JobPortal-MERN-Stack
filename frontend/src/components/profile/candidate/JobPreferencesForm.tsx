// frontend/src/components/profile/candidate/JobPreferencesForm.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { createOrUpdateProfile } from '../../../redux/slices/candidateProfileSlice';
import { toast } from 'react-toastify';
import Select from 'react-select';

// Định nghĩa interface cho options
interface OptionType {
  value: string;
  label: string;
}

const JobPreferencesForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.candidateProfile);

  const [formData, setFormData] = useState({
    jobType: [] as string[],
    expectedSalary: '',
    location: '',
    industries: [] as string[]
  });

  // Options cho select
  const jobTypeOptions: OptionType[] = [
    { value: 'Full-time', label: 'Toàn thời gian' },
    { value: 'Part-time', label: 'Bán thời gian' },
    { value: 'Remote', label: 'Từ xa' },
    { value: 'Internship', label: 'Thực tập' },
    { value: 'Contract', label: 'Hợp đồng' }
  ];

  const industryOptions: OptionType[] = [
    { value: 'IT', label: 'Công nghệ thông tin' },
    { value: 'Finance', label: 'Tài chính/Ngân hàng' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Education', label: 'Giáo dục' },
    { value: 'Healthcare', label: 'Y tế' },
    { value: 'Retail', label: 'Bán lẻ' },
    { value: 'Manufacturing', label: 'Sản xuất' },
    { value: 'Logistics', label: 'Logistics' }
  ];

  useEffect(() => {
    if (profile?.jobPreferences) {
      setFormData({
        jobType: profile.jobPreferences.jobType || [],
        expectedSalary: profile.jobPreferences.expectedSalary?.toString() || '',
        location: profile.jobPreferences.location || '',
        industries: profile.jobPreferences.industries || []
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Custom styles cho React-Select
  const customStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '38px',
      borderColor: '#D1D5DB',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9CA3AF',
      }
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#DBEAFE',
      borderRadius: '9999px',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#1E40AF',
      fontSize: '0.75rem',
      padding: '0 0.5rem',
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#3B82F6',
      ':hover': {
        backgroundColor: 'transparent',
        color: '#1E40AF',
      },
    }),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profileData = {
      jobPreferences: {
        jobType: formData.jobType,
        expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary) : undefined,
        location: formData.location,
        industries: formData.industries
      }
    };

    dispatch(createOrUpdateProfile(profileData));
    toast.success('Sở thích công việc đã được cập nhật');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Sở thích công việc</h3>
      <p className="text-gray-500 text-sm italic mb-4">Thiết lập sở thích công việc giúp bạn nhận được gợi ý việc làm phù hợp hơn</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
            Loại công việc
          </label>
          <Select
            id="jobType"
            isMulti
            options={jobTypeOptions}
            value={jobTypeOptions.filter(option => formData.jobType.includes(option.value))}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
              setFormData({ ...formData, jobType: selectedValues });
            }}
            placeholder="Chọn loại công việc"
            styles={customStyles}
            classNamePrefix="select"
          />
        </div>
        
        <div>
          <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
            Mức lương mong muốn (VNĐ/tháng)
          </label>
          <input
            type="number"
            name="expectedSalary"
            id="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="VD: 15000000"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Địa điểm làm việc mong muốn
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="VD: Hà Nội, Hồ Chí Minh"
          />
        </div>
        
        <div>
          <label htmlFor="industries" className="block text-sm font-medium text-gray-700 mb-2">
            Ngành nghề quan tâm
          </label>
          <Select
            id="industries"
            isMulti
            options={industryOptions}
            value={industryOptions.filter(option => formData.industries.includes(option.value))}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
              setFormData({ ...formData, industries: selectedValues });
            }}
            placeholder="Chọn ngành nghề"
            styles={customStyles}
            classNamePrefix="select"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </form>
    </div>
  );
};

export default JobPreferencesForm;