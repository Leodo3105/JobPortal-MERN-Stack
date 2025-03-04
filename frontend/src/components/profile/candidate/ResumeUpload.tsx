import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { uploadResume } from '../../../redux/slices/candidateProfileSlice';
import { toast } from 'react-toastify';

const ResumeUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.candidateProfile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!validTypes.includes(file.type)) {
        toast.error('Chỉ chấp nhận file PDF, DOC hoặc DOCX');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File không được vượt quá 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file CV');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
        const result = await dispatch(uploadResume(formData));
        if (uploadResume.fulfilled.match(result)) {
          toast.success('CV đã được tải lên thành công');
          setSelectedFile(null);
        } else {
          toast.error('Có lỗi xảy ra khi tải lên CV');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Có lỗi xảy ra khi tải lên CV');
      }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">CV của bạn</h3>

      {profile?.resumeUrl && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">CV hiện tại:</p>
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2h2.5a1 1 0 110 2H5v4.5a1.5 1.5 0 01-3 0V8z" />
            </svg>
            <a
              href={`${process.env.REACT_APP_API_URL}/${profile.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Xem CV
            </a>
          </div>
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Tải lên CV mới
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Tải lên CV mới"  
            title="Chọn file CV để tải lên"  
            disabled={loading}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Chỉ chấp nhận file PDF, DOC hoặc DOCX. Kích thước tối đa 5MB.
        </p>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Đang tải lên...' : 'Tải lên'}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;