// backend/services/emailService.js
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';
import Job from '../models/Job.js';

// Gửi email thông báo khi có ứng viên mới
export const sendNewApplicationEmail = async (application) => {
  try {
    // Lấy thông tin job và employer
    const job = await Job.findById(application.job).populate('employer', 'name email');
    const candidate = await User.findById(application.candidate, 'name email');
    
    const applicationDate = new Date(application.createdAt).toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    await sendEmail({
      email: job.employer.email,
      subject: `Ứng viên mới cho vị trí ${job.title}`,
      template: 'new-application',
      data: {
        employerName: job.employer.name,
        jobTitle: job.title,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        applicationDate,
        applicationUrl: `${process.env.FRONTEND_URL}/employer/applications/${application._id}`,
        currentYear: new Date().getFullYear()
      }
    });
    
    console.log(`New application email sent to employer ${job.employer.email}`);
  } catch (error) {
    console.error('Error sending new application email:', error);
  }
};

// Gửi email khi trạng thái đơn ứng tuyển thay đổi
export const sendApplicationStatusEmail = async (application, previousStatus) => {
  try {
    // Chỉ gửi nếu trạng thái thực sự thay đổi
    if (previousStatus === application.status) {
      return;
    }
    
    // Lấy thông tin job, company, and candidate
    const job = await Job.findById(application.job, 'title company');
    const candidate = await User.findById(application.candidate, 'name email');
    
    // Map status sang text hiển thị
    const statusMap = {
      'pending': 'Chờ xem xét',
      'reviewed': 'Đã xem xét',
      'shortlisted': 'Trong danh sách ngắn',
      'rejected': 'Từ chối',
      'interview': 'Mời phỏng vấn',
      'hired': 'Đã tuyển dụng'
    };
    
    // Lấy ghi chú mới nhất nếu có
    let note = '';
    if (application.notes && application.notes.length > 0) {
      // Lấy ghi chú gần nhất
      note = application.notes[0].text;
    }
    
    await sendEmail({
      email: candidate.email,
      subject: `Cập nhật đơn ứng tuyển: ${job.title}`,
      template: 'application-status',
      data: {
        candidateName: candidate.name,
        jobTitle: job.title,
        companyName: job.company.name,
        status: application.status,
        statusText: statusMap[application.status] || 'Đã cập nhật',
        note,
        applicationUrl: `${process.env.FRONTEND_URL}/applications/${application._id}`,
        isRejected: application.status === 'rejected',
        isInterview: application.status === 'interview',
        jobSearchUrl: `${process.env.FRONTEND_URL}/jobs`,
        currentYear: new Date().getFullYear()
      }
    });
    
    console.log(`Application status email sent to candidate ${candidate.email}`);
  } catch (error) {
    console.error('Error sending application status email:', error);
  }
};