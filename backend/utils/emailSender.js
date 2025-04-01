const nodemailer = require("nodemailer");
require("dotenv").config(); // Make sure environment variables load

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail
    pass: process.env.EMAIL_PASS       // your App Password
  },
});

async function sendEmail({ to, subject, text, attachmentPath }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  if (attachmentPath) {
    mailOptions.attachments = [
      {
        filename: attachmentPath.split("/").pop(), // extract filename
        path: attachmentPath,
      },
    ];
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}

module.exports = sendEmail;
