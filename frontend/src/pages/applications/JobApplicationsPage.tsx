import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { getJobById } from "../../redux/slices/jobSlice";
import {
  getJobApplications,
  updateApplicationStatus,
  addApplicationNote,
} from "../../redux/slices/applicationSlice";
import moment from "moment";
import { toast } from "react-toastify";

const JobApplicationsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const dispatch = useAppDispatch();
  const { currentJob } = useAppSelector((state) => state.job);
  const { applications, loading } = useAppSelector(
    (state) => state.application
  );
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);

  useEffect(() => {
    if (jobId) {
      dispatch(getJobById(jobId));
      dispatch(getJobApplications(jobId));
    }
  }, [dispatch, jobId]);

  // Xử lý khi thay đổi trạng thái đơn ứng tuyển
  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      setSelectedStatus(status);
      setSelectedApplicationId(applicationId);

      if (["rejected", "interview", "hired"].includes(status)) {
        // Nếu trạng thái là loại, phỏng vấn hoặc tuyển dụng, hiển thị modal thêm ghi chú
        setShowNoteModal(true);
      } else {
        // Cập nhật trạng thái mà không cần ghi chú
        await dispatch(updateApplicationStatus({ id: applicationId, status }));
        toast.success("Đã cập nhật trạng thái đơn ứng tuyển");
      }
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Xử lý khi lưu ghi chú và trạng thái
  const handleSaveNoteAndStatus = async () => {
    try {
      if (!selectedApplicationId || !selectedStatus) return;

      // Cập nhật trạng thái trước
      await dispatch(
        updateApplicationStatus({
          id: selectedApplicationId,
          status: selectedStatus,
        })
      );

      // Nếu có ghi chú, thêm ghi chú
      if (noteText.trim()) {
        await dispatch(
          addApplicationNote({
            id: selectedApplicationId,
            text: noteText.trim(),
          })
        );
      }

      toast.success("Đã cập nhật đơn ứng tuyển");
      setShowNoteModal(false);
      setNoteText("");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  // Hiển thị trạng thái đơn ứng tuyển
  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Chờ xem xét
          </span>
        );
      case "reviewed":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Đã xem xét
          </span>
        );
      case "shortlisted":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Trong danh sách ngắn
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Từ chối
          </span>
        );
      case "interview":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
            Phỏng vấn
          </span>
        );
      case "hired":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Đã tuyển
          </span>
        );
      default:
        return null;
    }
  };

  // Options cho select trạng thái
  const statusOptions = [
    { value: "pending", label: "Chờ xem xét" },
    { value: "reviewed", label: "Đã xem xét" },
    { value: "shortlisted", label: "Trong danh sách ngắn" },
    { value: "interview", label: "Phỏng vấn" },
    { value: "hired", label: "Đã tuyển" },
    { value: "rejected", label: "Từ chối" },
  ];

  if (loading && !applications.length) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex">
          <Link
            to="/employer/jobs"
            className="text-gray-500 hover:text-blue-600"
          >
            Quản lý tin tuyển dụng
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-800">Danh sách ứng viên</span>
        </nav>
      </div>

      {/* Thông tin công việc */}
      {currentJob && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            {currentJob.title}
          </h1>
          <p className="text-gray-600 mb-1">{currentJob.company.name}</p>
          <p className="text-gray-500 mb-2">{currentJob.location}</p>

          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">
              <span className="font-medium">Ngày đăng:</span>{" "}
              {moment(currentJob.createdAt).format("DD/MM/YYYY")}
            </span>
            <span>
              <span className="font-medium">Hạn nộp:</span>{" "}
              {moment(currentJob.deadline).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
      )}

      {/* Danh sách ứng viên */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Danh sách ứng viên ({applications.length})
          </h2>
        </div>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ứng viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày nộp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {typeof application.candidate === "object"
                            ? application.candidate.name
                            : ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {typeof application.candidate === "object"
                            ? application.candidate.email
                            : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {moment(application.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`${process.env.REACT_APP_API_URL}/${application.resumeUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Xem CV
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {renderStatus(application.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-3">
                        <select
                          aria-label="Change application status"
                          value={application.status}
                          onChange={(e) =>
                            handleStatusChange(application._id, e.target.value)
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <Link
                          to={`/employer/applications/${application._id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              Chưa có ứng viên nào ứng tuyển vào vị trí này
            </p>
          </div>
        )}
      </div>

      {/* Modal thêm ghi chú */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thêm ghi chú cho ứng viên
            </h3>
            <div className="mb-4">
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ghi chú
              </label>
              <textarea
                id="note"
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập ghi chú về ứng viên này..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNoteAndStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsPage;
