import nodemailer from "nodemailer";

export const sendEmail = async ({
  to = "",
  text = "",
  subject = "",
  html = "",
  attachments = [],
  cc = "",
  bcc = "",
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Secret messages  "<${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    attachments,
  });

  console.log("Message sent:", info.messageId);
};

export const subjectEmail = {
  WELCOME: "Welcome to Secret messages ",
  PASSWORD_RESET: "Password Reset Request",
  CONFIRM_EMAIL: "Confirm Your Email Address",
};
