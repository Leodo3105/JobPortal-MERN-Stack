import nodemailer from 'nodemailer';

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

  // Cấu hình email
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Gửi email
  const info = await transporter.sendMail(message);

  console.log(`Message sent: ${info.messageId}`);
};

export default sendEmail;