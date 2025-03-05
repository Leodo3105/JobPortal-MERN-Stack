import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { searchJobs } from '../../redux/slices/jobSlice';
import JobSearchForm from '../../components/jobs/JobSearchForm';
import JobFilterSidebar from '../../components/jobs/JobFilterSidebar';
import JobCard from '../../components/jobs/JobCard';

const JobSearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading, totalJobs, pagination } = useAppSelector((state) => state.job);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    jobType: searchParams.getAll('jobType') || [],
    experience: searchParams.get('experience') || '',
    education: searchParams.get('education') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
  });

  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    // Dispatch search action with all filters
    dispatch(searchJobs({
      keyword,
      location,
      jobType: filters.jobType,
      experience: filters.experience,
      education: filters.education,
      salaryMin: filters.salaryMin ? parseInt(filters.salaryMin) : undefined,
      salaryMax: filters.salaryMax ? parseInt(filters.salaryMax) : undefined,
      page,
      limit: 10
    }));
  }, [dispatch, keyword, location, filters.jobType, filters.experience, filters.education, filters.salaryMin, filters.salaryMax, page]);

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams();
    
    if (keyword) newSearchParams.append('keyword', keyword);
    if (location) newSearchParams.append('location', location);
    
    filters.jobType.forEach(type => {
      newSearchParams.append('jobType', type);
    });
    
    if (filters.experience) newSearchParams.append('experience', filters.experience);
    if (filters.education) newSearchParams.append('education', filters.education);
    if (filters.salaryMin) newSearchParams.append('salaryMin', filters.salaryMin);
    if (filters.salaryMax) newSearchParams.append('salaryMax', filters.salaryMax);
    
    // Reset to page 1 when applying new filters
    newSearchParams.append('page', '1');
    
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    setSearchParams(newSearchParams);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tìm kiếm việc làm</h1>
      
      {/* Search Form */}
      <div className="mb-8">
        <JobSearchForm 
          inline={true} 
          initialKeyword={keyword} 
          initialLocation={location} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <JobFilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            applyFilters={applyFilters} 
          />
        </div>
        
        {/* Job List */}
        <div className="lg:col-span-3">
          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-medium">{totalJobs}</span> việc làm phù hợp
              {keyword && <span> với từ khóa "<span className="font-medium">{keyword}</span>"</span>}
              {location && <span> tại "<span className="font-medium">{location}</span>"</span>}
            </p>
          </div>
          
          {/* Job Cards */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg shadow-sm">
              <p className="text-gray-500">Không tìm thấy việc làm phù hợp</p>
              <p className="text-gray-500 mt-2">Vui lòng thử với từ khóa hoặc bộ lọc khác</p>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === i + 1
                        ? 'text-blue-600 bg-blue-50 z-10'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;