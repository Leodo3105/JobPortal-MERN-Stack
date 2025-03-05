import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

interface JobSearchFormProps {
  inline?: boolean;
  initialKeyword?: string;
  initialLocation?: string;
}

const JobSearchForm: React.FC<JobSearchFormProps> = ({ 
  inline = false, 
  initialKeyword = '', 
  initialLocation = '' 
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [jobType, setJobType] = useState<string[]>([]);
  const navigate = useNavigate();

  const jobTypeOptions = [
    { value: 'Full-time', label: 'Toàn thời gian' },
    { value: 'Part-time', label: 'Bán thời gian' },
    { value: 'Remote', label: 'Từ xa' },
    { value: 'Internship', label: 'Thực tập' },
    { value: 'Contract', label: 'Hợp đồng' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Xây dựng query params
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    
    jobType.forEach(type => {
      params.append('jobType', type);
    });
    
    navigate(`/jobs/search?${params.toString()}`);
  };

  if (inline) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Từ khóa, vị trí, công ty..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Địa điểm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Tìm kiếm
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="keyword" className="block text-gray-700 font-medium mb-2">
          Từ khóa
        </label>
        <input
          id="keyword"
          type="text"
          placeholder="Từ khóa, vị trí, công ty..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
          Địa điểm
        </label>
        <input
          id="location"
          type="text"
          placeholder="Thành phố, khu vực..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="jobType" className="block text-gray-700 font-medium mb-2">
          Loại công việc
        </label>
        <Select
          id="jobType"
          isMulti
          options={jobTypeOptions}
          onChange={(selectedOptions) => {
            setJobType(selectedOptions ? selectedOptions.map(option => option.value) : []);
          }}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Chọn loại công việc"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors font-medium"
      >
        Tìm kiếm
      </button>
    </form>
  );
};

export default JobSearchForm;