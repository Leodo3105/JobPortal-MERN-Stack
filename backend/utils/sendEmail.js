// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn đến thư mục templates
const templateDir = path.join(__dirname, '../templates/emails');

const sendEmail = async (options) => {
  // Tạo transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  let htmlContent = '';
  
  // Nếu có template, sử dụng template, ngược lại sử dụng message trực tiếp
  if (options.template) {
    // Đọc nội dung template
    const templatePath = path.join(templateDir, `${options.template}.html`);
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Compile template với dữ liệu
    const compiledTemplate = Handlebars.compile(template);
    htmlContent = compiledTemplate(options.data || {});
  }

  // Cấu hình email
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message || '', // Plain text version
    html: htmlContent || options.message // HTML version (preferred)
  };

  // Gửi email
  const info = await transporter.sendMail(message);

  console.log(`Message sent: ${info.messageId}`);
  return info;
};

export default sendEmail;