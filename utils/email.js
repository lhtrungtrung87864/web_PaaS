const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // email admin
    pass: process.env.EMAIL_PASS  // app password nếu dùng Gmail
  }
});

const sendNewUserEmail = (to, username, email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,  // admin email
    subject: "New User Registered",
    text: `User "${username}" với email "${email}" vừa đăng ký hệ thống.`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Email error:", err);
    else console.log("Email sent:", info.response);
  });
};

module.exports = { sendNewUserEmail };
