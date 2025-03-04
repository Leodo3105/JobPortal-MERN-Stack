import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getCurrentProfile } from '../../redux/slices/employerProfileSlice';
import CompanyProfileForm from '../../components/profile/employer/CompanyProfileForm';
import CompanyImageUpload from '../../components/profile/employer/CompanyImageUpload';

const EmployerProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, completionPercentage, loading } = useAppSelector((state) => state.employerProfile);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ công ty</h1>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Mức độ hoàn thiện hồ sơ
          </h3>
          <span className="text-sm font-medium text-gray-700">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`bg-blue-600 h-2.5 rounded-full w-[${completionPercentage}%]`}
          ></div>
        </div>
      </div>

      {loading && !profile ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin công ty</h2>
              <CompanyProfileForm />
            </div>
          </div>
          
          <div className="md:col-span-1">
            <CompanyImageUpload />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProfilePage;