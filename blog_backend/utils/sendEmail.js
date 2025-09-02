// const transporter = require('../config/email');

// const sendEmail = async (to, subject, html) => {
//   try {
//     // Check if transporter exists
//     if (!transporter) {
//       console.log('📧 Email transporter not configured, skipping email send');
//       return;
//     }
    
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html,
//     });
//     console.log('📧 Email sent successfully to:', to);
//   } catch (error) {
//     console.log('📧 Email sending failed:', error.message);
//     // Don't throw error, just log it
//   }
// };

// module.exports = sendEmail; 

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;

