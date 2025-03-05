import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    company: {
      name: string;
      logo?: string;
    };
    location: string;
    jobType: string[];
    salary?: {
      min?: number;
      max?: number;
      isNegotiable: boolean;
      currency: string;
    };
    createdAt: string;
    deadline: string;
  };
  variant?: 'default' | 'compact';
}

const JobCard: React.FC<JobCardProps> = ({ job, variant = 'default' }) => {
  // Định dạng hiển thị lương
  const formatSalary = () => {
    if (!job.salary) return 'Thỏa thuận';
    
    const { min, max, isNegotiable, currency } = job.salary;
    
    if (isNegotiable) return 'Thỏa thuận';
    
    if (min && max) {
      return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} ${currency}`;
    } else if (min) {
      return `Từ ${min.toLocaleString('vi-VN')} ${currency}`;
    } else if (max) {
      return `Đến ${max.toLocaleString('vi-VN')} ${currency}`;
    }
    
    return 'Thỏa thuận';
  };
  
  // Tính toán thời gian còn lại đến hạn
  const timeLeft = () => {
    const deadlineDate = moment(job.deadline);
    const now = moment();
    
    if (deadlineDate.isBefore(now)) {
      return <span className="text-red-500">Đã hết hạn</span>;
    }
    
    const days = deadlineDate.diff(now, 'days');
    
    if (days === 0) {
      return <span className="text-orange-500">Còn hôm nay</span>;
    } else if (days === 1) {
      return <span className="text-orange-500">Còn 1 ngày</span>;
    } else if (days <= 3) {
      return <span className="text-orange-500">Còn {days} ngày</span>;
    }
    
    return <span>Còn {days} ngày</span>;
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <Link to={`/jobs/${job._id}`} className="block">
          <div className="flex items-center mb-2">
            {job.company.logo ? (
              <img 
                src={job.company.logo} 
                alt={job.company.name} 
                className="w-10 h-10 object-contain mr-3"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full mr-3">
                <span className="text-gray-500 font-bold">{job.company.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company.name}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {job.jobType.slice(0, 2).map((type, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link to={`/jobs/${job._id}`} className="block">
        <div className="flex justify-between">
          <div className="flex items-start">
            {job.company.logo ? (
              <img 
                src={job.company.logo} 
                alt={job.company.name} 
                className="w-16 h-16 object-contain mr-4"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full mr-4">
                <span className="text-gray-500 text-xl font-bold">{job.company.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
              <p className="text-gray-600 mb-1">{job.company.name}</p>
              <p className="text-gray-500 mb-2">{job.location}</p>
              
              <div className="flex flex-wrap gap-2">
                {job.jobType.map((type, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-green-600 font-medium mb-1">{formatSalary()}</p>
            <p className="text-sm text-gray-500 mb-1">
              {moment(job.createdAt).format('DD/MM/YYYY')}
            </p>
            <p className="text-sm">{timeLeft()}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;