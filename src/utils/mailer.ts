import nodemailer from "nodemailer";

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  await transporter.sendMail({
    from: 'no-reply@decession.com',
    to: options.to,
    subject: options.subject,
    text: options.text, 
    html: options.html, 
  });
};