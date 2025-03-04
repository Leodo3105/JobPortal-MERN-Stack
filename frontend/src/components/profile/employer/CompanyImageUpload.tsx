import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { uploadLogo, uploadCoverImage } from '../../../redux/slices/employerProfileSlice';
import { toast } from 'react-toastify';

const CompanyImageUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.employerProfile);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Kiểm tra loại file
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
        return;
      }
      // Kiểm tra kích thước file (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File không được vượt quá 2MB');
        return;
      }
      setFile(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!selectedLogo) {
      toast.error('Vui lòng chọn file logo');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedLogo);
    
    const result = await dispatch(uploadLogo(formData));
    if (uploadLogo.fulfilled.match(result)) {
      toast.success('Logo đã được tải lên thành công');
      setSelectedLogo(null);
    }
  };

  const handleUploadCover = async () => {
    if (!selectedCover) {
      toast.error('Vui lòng chọn file ảnh bìa');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedCover);
    
    const result = await dispatch(uploadCoverImage(formData));
    if (uploadCoverImage.fulfilled.match(result)) {
      toast.success('Ảnh bìa đã được tải lên thành công');
      setSelectedCover(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logo công ty</h3>
        
        {profile?.logoUrl && profile.logoUrl !== 'default-company-logo.jpg' && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Logo hiện tại:</p>
            <img 
              src={`${process.env.REACT_APP_API_URL}/${profile.logoUrl}`}
              alt="Company Logo"
              className="h-24 w-auto object-contain border rounded p-1"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Tải lên logo mới
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setSelectedLogo)}
              accept="image/jpeg,image/png,image/gif"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              title="Chọn file logo để tải lên"
              aria-label="Tải lên logo mới"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Chỉ chấp nhận file ảnh (JPEG, PNG, GIF). Kích thước tối đa 2MB.
          </p>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleUploadLogo}
            disabled={!selectedLogo || loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Đang tải lên...' : 'Tải lên logo'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ảnh bìa công ty</h3>
        
        {profile?.coverImageUrl && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Ảnh bìa hiện tại:</p>
            <img 
              src={`${process.env.REACT_APP_API_URL}/${profile.coverImageUrl}`}
              alt="Company Cover"
              className="w-full h-40 object-cover border rounded"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Tải lên ảnh bìa mới
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setSelectedCover)}
              accept="image/jpeg,image/png,image/gif"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              title="Chọn file ảnh bìa để tải lên"
              aria-label="Tải lên ảnh bìa mới"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Chỉ chấp nhận file ảnh (JPEG, PNG, GIF). Kích thước tối đa 2MB.
          </p>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleUploadCover}
            disabled={!selectedCover || loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Đang tải lên...' : 'Tải lên ảnh bìa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyImageUpload;