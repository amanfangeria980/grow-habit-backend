const nodemailer = require('nodemailer');

// Create transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Sends an email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient Array of email addresses (required)
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version of email
 * @param {string} options.html - HTML version of email (optional)
 * @returns {Promise} - Resolves with info about sent email
 */
const sendEmail = async ({ to, subject, text, html }: { to: string[] | string; subject: string; text: string; html: string }) => {
    try {
        console.log('Sending email to:', to, 'with subject:', subject, 'and text:', text, 'and html:', html);
        const toArray = Array.isArray(to) ? to.join(', ') : to;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: toArray,
            subject,
            text,
            html: html || text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent response:', info);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = {
    sendEmail,
};

// const { sendEmail } = require('../utils/email');

// sendEmail({
//     to: 'vidyaashram.edu@gmail.com',
//     subject: 'Test Email',
//     text: 'This is a test email',
//     html: '<p>This is a test email</p>',
// });
