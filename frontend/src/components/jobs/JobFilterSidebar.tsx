import React from 'react';
import Select from 'react-select';

interface JobFilterSidebarProps {
  filters: {
    jobType: string[];
    experience: string;
    education: string;
    salaryMin: string;
    salaryMax: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    jobType: string[];
    experience: string;
    education: string;
    salaryMin: string;
    salaryMax: string;
  }>>;
  applyFilters: () => void;
}

const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({ 
  filters, 
  setFilters, 
  applyFilters 
}) => {
  const jobTypeOptions = [
    { value: 'Full-time', label: 'Toàn thời gian' },
    { value: 'Part-time', label: 'Bán thời gian' },
    { value: 'Remote', label: 'Từ xa' },
    { value: 'Internship', label: 'Thực tập' },
    { value: 'Contract', label: 'Hợp đồng' }
  ];

  const experienceOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'Không yêu cầu', label: 'Không yêu cầu' },
    { value: '1 năm', label: '1 năm' },
    { value: '2 năm', label: '2 năm' },
    { value: '3-5 năm', label: '3-5 năm' },
    { value: '5-10 năm', label: '5-10 năm' },
    { value: 'Trên 10 năm', label: 'Trên 10 năm' }
  ];

  const educationOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'Không yêu cầu', label: 'Không yêu cầu' },
    { value: 'Trung cấp', label: 'Trung cấp' },
    { value: 'Cao đẳng', label: 'Cao đẳng' },
    { value: 'Đại học', label: 'Đại học' },
    { value: 'Thạc sĩ', label: 'Thạc sĩ' },
    { value: 'Tiến sĩ', label: 'Tiến sĩ' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      jobType: [],
      experience: '',
      education: '',
      salaryMin: '',
      salaryMax: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-800">Bộ lọc</h3>
        <button
          type="button"
          onClick={resetFilters}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Đặt lại
        </button>
      </div>

      <div className="space-y-6">
        {/* Loại công việc */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Loại công việc
          </label>
          <Select
            isMulti
            options={jobTypeOptions}
            value={jobTypeOptions.filter(option => filters.jobType.includes(option.value))}
            onChange={(selectedOptions) => {
              setFilters(prev => ({
                ...prev,
                jobType: selectedOptions ? selectedOptions.map(option => option.value) : []
              }));
            }}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Chọn loại công việc"
          />
        </div>

        {/* Kinh nghiệm */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Kinh nghiệm
          </label>
          <Select
            options={experienceOptions}
            value={experienceOptions.find(option => option.value === filters.experience) || null}
            onChange={(selectedOption) => {
              setFilters(prev => ({
                ...prev,
                experience: selectedOption ? selectedOption.value : ''
              }));
            }}
            className="basic-select"
            classNamePrefix="select"
            placeholder="Chọn yêu cầu kinh nghiệm"
            isClearable
          />
        </div>

        {/* Học vấn */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Trình độ học vấn
          </label>
          <Select
            options={educationOptions}
            value={educationOptions.find(option => option.value === filters.education) || null}
            onChange={(selectedOption) => {
              setFilters(prev => ({
                ...prev,
                education: selectedOption ? selectedOption.value : ''
              }));
            }}
            className="basic-select"
            classNamePrefix="select"
            placeholder="Chọn trình độ học vấn"
            isClearable
          />
        </div>

        {/* Mức lương */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mức lương (VNĐ)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                name="salaryMin"
                placeholder="Từ"
                value={filters.salaryMin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="salaryMax"
                placeholder="Đến"
                value={filters.salaryMax}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={applyFilters}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
};

export default JobFilterSidebar;