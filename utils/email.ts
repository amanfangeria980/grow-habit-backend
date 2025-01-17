import nodemailer from 'nodemailer';

// Create transporter configuration
const transporter = nodemailer.createTransport({
    service: 'smtp',
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
} as nodemailer.TransportOptions);

// sendEmail({
//     to: 'vidyaashram.edu@gmail.com',
//     subject: 'Test Email',
//     text: 'This is a test email',
//     html: '<p>This is a test email</p>',
// });

const sendEmail = async ({
    to,
    subject,
    text,
    html,
}: {
    to: string[] | string;
    subject: string;
    text: string | undefined;
    html: string | undefined;
}) => {
    try {
        console.log('Sending email to:', to, 'with subject:', subject, 'and text:', text, 'and html:', html);
        const toArray = Array.isArray(to) ? to.join(', ') : to;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: toArray,
            subject,
            text,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent response:', info);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export default sendEmail;
